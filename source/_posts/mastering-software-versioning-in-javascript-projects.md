---
title: Mastering Software Versioning in JavaScript Projects
date: 2020-11-07 16:22:37
tags:
---

# Introduction

A frequently overlooked aspect of software development is the proper versioning of code. Consistent and descriptive version numbers not only help developers keep track of their own work, but can also inform users of your software about what to expect from a new release. While versioning is especially important for libraries and frameworks which other projects depend on, benefits apply to standalone applications equally.

In this article, we introduce techniques, conventions, and tooling that helped us establish a robust way of versioning our JavaScript- and/or TypeScript-based software projects. 

# Concepts

## Semantic Versioning

One of the most important aspects to think of when it comes to versioning is the version number itself. Before caring about tooling and others, you need to come up with syntax and semantics for it. 

A concept that is well established among open source software projects is [Semantic Versioning](https://semver.org/), or _SemVer_. When following this specification, a version number consists of three digits separated by dots, like `1.5.4` or, more formally `<MAJOR>.<MINOR>.<PATCH>`, where each individual part has a meaning:

* `MAJOR`: Incrementing it indicates that there have been fundamental changes to the software and the new version is most likely not backward-compatible with the previous one.
* `MINOR`: Essentially indicates that new features were added, but backward-compatibiltiy is still guaranteed.
* `PATCH` or `BUG FIX`: Gives a hint that minor changes or bug fixes had been introduced recently.

Strictly following these semantics helps to maintain a common understanding of what a certain version means and what to expect from a new release.

## Conventional Commits

The second concept that we committed ourselves to follow is [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). Similar to semantic versioning, the conventional commits specification provides common syntax and semantics for information provided by a developer. However, in this case, the convention is not about the version number itself, but about the commit messages composed by developers when checking in new code into version control. The goal is to standardize their format and make them machine-readable to a certain extent.

When following conventional commits, a commit message essentially has to be prefixed with one of a few keywords.

* `fix:` – A commit message with this prefix indicates a bug fix
* `feat:` – A commit message with this prefix indicates the introduction of a new feature or functionality
* `refactor:` – A commit with, whose message is prefixed like this, contains code refactorings, i.e. internal, technical modifications of the implementation of certain logic
* `chore:` – This prefix indicates minor, miscellaneous changes of any type, that do not necessarily affect the user immediately
* `BREAKING CHANGE!:` A commit message with this prefix warns about comprehensive, fundamental changes and indicates that the newly released version is likely to be incompatible with the previous one

The conventional commits specification comprises a few more keywords and also allows developers to come up with custom ones. However, these are the most relevant ones.

# Tooling

When having paid attention, one might have recognized a few similarities in the semantics of conventional commits and semantic versioning. Commits with `fix`-changes correspond to the `PATCH` version, `feat` goes well with the `MINOR` version and `BREAKING CHANGE`es will inevitably result in a new `MAJOR` version. 

As a consequence of following the above conventions, we enabled our project for an automated versioning workflow. 

## [standard-version](https://www.npmjs.com/package/standard-version) CLI

[standard-version](https://www.npmjs.com/package/standard-version) is a JavaScript tool that utilizes conventional commits to automatically enforce semantic versioning. Moreover, it is capable of automatically generating a changelog in Markdown format, which developers can provide their users with. 

When running `standard-version`, the tool scans your commit history since when it was last executed, searches for fixes, feats, or breaking changes, and adapts the project's version accordingly.

To add it to an existing project, all you need to do is:

1. Install it as a dependency
```bash
$ yarn add -D standard-version  # (or npm i --save-dev standard-version)
```

2. Optionally add it as an NPM script to your `package.json`
```json
{
    "name": "your-cool-project",
    "version:": "0.0.1",
    ...
    "scripts:" {
        "release": "standard-version"
        ...
    }
    ...
}
```

# Release Workflow

After the development team has committed to consequently follow the conventional commits specification and all tooling is set up, a typical workflow to release new versions of your software might look like so.

Once a new version is ready to be released, i.e. at the end of a sprint, a developer executes `yarn release` (or `npm run release`) to kick off `standard-version`. As a result ...

1. ... the project's commit history is scanned to determine which part of the version number needs to be incremented
1. ... the `version` property of the project's top-level `package.json` is set to the new version
1. ... a `CHANGELOG.md` file is written, containing separate sections for features and bug fixes
1. ... the changes are committed to Git
1. ... the new commit is given a Git tag corresponding to the new version

Depending on your setup, a push to the remote repository might kick off your CI/CD workflow, which may automatically build a new Docker image with the newly introduced tag and push it to a public or private registry. Using tools like [Watchtower](https://github.com/containrrr/watchtower), the new image might even be rolled out to production automatically.

The only manual steps required in this workflow were a single `yarn release` command and a Git push. Nothing more, nothing less.

# Conclusion

The above workflow has proven to be a convenient and consistent way of managing and releasing new versions of our JavaScript- and TypeScript-based frontend-, backend- and library projects and is even more beneficial with proper CI/CD pipelines and tooling like [GitLab](https://gitlab.com), [Docker](https://docker.io), [Watchtower](https://github.com/containrrr/watchtower), [Portainer](https://portainer.io), and others. It might even be adapted to projects written in other programming languages. 