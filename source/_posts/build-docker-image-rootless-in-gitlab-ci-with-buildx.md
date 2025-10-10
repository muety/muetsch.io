---
title: Build Docker image rootless in GitLab CI with Buildx
date: 2025-10-09 20:19:46
tags: [software-engineering]
---

<img src="images/gitlab_docker.svg" style="height: 200px; margin: 24px auto;">

As a developer or DevOps person, a common use case is to build Docker images as part of your CI/CD pipeline. No matter whether you use [Jenkins](https://www.jenkins.io/), [Wookpecker CI](https://woodpecker-ci.org/), [GitLab CI](https://docs.gitlab.com/ci/) or any other of the many existing CI servers, a typical setup is to have the build runners themselves be Docker containers as well. You'll end up having to build [Docker in Docker](https://www.docker.com/resources/docker-in-docker-containerized-ci-workflows-dockercon-2023/). While the easiest and most straightforward way to implement this is to mount the Docker daemon into the container itself, it's not necessarily the most secure way. Instead, you may want to build your images in a **rootless** fashion and **without requiring a Docker daemon**.

For a long time, Google's [Kaniko](https://github.com/GoogleContainerTools/kaniko) has been de-facto standard there, but at latest after the project has been [discontinued](https://www.reddit.com/r/kubernetes/comments/1l2dto9/kaniko_has_finally_officially_been_archived/), an alternative was needed. I had to migrate most of my CI pipelines and my particular requirements were the following.

**Requirements:**
- Build must run inside Docker, but **rootless** and without access to the host daemon
- Images shall be pushed to a **private registry** upon successful build
- If a **Git tag** is given, use that tag (alongside `latest`) for the image as well, otherwise use the **commit hash** and **branch name** as tags
- Intermediate layers shall be **cached** for efficiency and speed
- Upstream images shall be pulled from a local **mirror registry**

Turns out this is harder than you would think. After a bit of research I found that using Docker [Buildx](https://docs.docker.com/reference/cli/docker/buildx/) is the recommended approach today – even though not necessarily the simplest. 

After I worked out a solution, I thought it might be helpful to share it. So here is a **GitLab CI pipeline** that fulfills the above requirements.

```yaml
stages:
  - publish

# Run pipeline jobs for merge requests, tags, and pushes by default
workflow:
  rules:
    - if: $CI_COMMIT_TAG
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_MERGE_REQUEST_ID

build-docker-image:
  stage: publish
  image:
    name: moby/buildkit:rootless
    entrypoint: [ "" ]

  before_script:
    - mkdir -p ~/.docker
    
    # Log in to private GitLab registry
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > ~/.docker/config.json

    # Retrieve commit hash / tag from repo and (and current date)
    - COMMIT_REF=$(echo $COMMIT_REF | sed -e 's/.*\///')
    - BUILD_DATE=$(date -Iseconds)

    # Configure internal registry mirror to use (optional)
    - mkdir -p /home/user/.config/buildkit
    - |
      cat > /home/user/.config/buildkit/buildkitd.toml <<EOF
      [registry."docker.io"]
        mirrors = ["docker-mirror01.example.org"]
      EOF

    # Start buildkit daemon inside the container 
    - rootlesskit buildkitd --oci-worker-no-process-sandbox &
    - export BUILDKIT_HOST=unix:///run/user/$(id -u)/buildkit/buildkitd.sock
    - while ! buildctl debug workers; do sleep 1; done

  script:
    # Build image, tag it with commit hash, branch name and - if given - commit tag and `latest`
    # Push image to same GitLab project's container registry
    - |
      buildctl build \
        --frontend dockerfile.v0 \
        --local context=$CI_PROJECT_DIR \
        --local dockerfile=$CI_PROJECT_DIR \
        --opt filename=Dockerfile \
        --opt build-arg:VERSION=$VERSION \
        --opt build-arg:BUILD_DATE=$BUILD_DATE \
        --output type=image,\"name=$CI_REGISTRY_IMAGE:${CI_COMMIT_TAG:-$COMMIT_REF},$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA${CI_COMMIT_TAG:+,${CI_REGISTRY_IMAGE}:latest}\",push=true \
        --export-cache type=registry,ref=$CI_REGISTRY_IMAGE:buildcache \
        --import-cache type=registry,ref=$CI_REGISTRY_IMAGE:buildcache
```

Hope that helps! 🤓