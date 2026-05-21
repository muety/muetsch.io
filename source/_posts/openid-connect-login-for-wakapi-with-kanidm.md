---
title: OpenID Connect login for Wakapi with Kanidm
date: 2026-05-14 09:28:36
tags: [selfhosted, sysadmin, linux]
---

# Introduction

<div class="image-container">
    <img src="images/kanidm_logo.svg" style="max-height: 200px; display: inline;">
    <img src="images/wakapi_logo.svg" style="max-height: 200px; display: inline;">
</div>

In this article, I'll explain how to **(1) set up [Kanidm](https://kanidm.com/)** as an alternative to identity management (IDM) solutions like KeyCloak or Authentik and **(2) configure it to be used for single sign-on (SSO)** in [Wakapi](https://wakapi.dev).

# Kanidm setup
In the following sections, I'll quickly walk you through setting up a self-hosted Kanidm instance. In case you already have one running you can mostly skip this part and jump straight to the Wakapi configuration.

Another, more "declarative" way of provisioning and configuring Kanidm is to use the excellent [kanidm-provision](https://thinglab.org/2025/02/keycloak_to_kanidm/) tool, as showcased in [this article](https://thinglab.org/2025/02/keycloak_to_kanidm/).

## Running the server
Since claiming to be _"secure by default_, Kanidm is quite stringent about its security configuration and strictly [mandates TLS](https://kanidm.github.io/kanidm/stable/frequently_asked_questions.html?highlight=tls#why-tls). That is, even for a local development setup, you'll need TLS certificates.
In this guide, we'll generate a **self-signed certificate**, but in production you must, of course, always request a real certificate, e.g. from Let's Encrypt.

Also, we'll use the following **local domain names** in this example. In a real-world setup, you will, of course, have _real_ domains (such as _wakapi.example.org_):
* Kanidm will be served at **idm.local**
* Wakapi will be served at **wakapi.local**

To make these resolve locally, I simply edited by `/etc/hosts`. But, again, that's only for the sake of this tutorial. You will use actual, publicly routed domains for your setup.

### Create self-signed certificate
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes
```

You may just skip the interactive questions and leave all attributes at their defaults.

**Important:** For a production setup, you'll want to use tools like [acme.sh](https://github.com/acmesh-official/acme.sh), [certbot](https://certbot.eff.org/) or even [Caddy](https://caddyserver.com) (possibly configured as a reverse proxy in front of your Kanidm) to issue TLS certificates via [HTTP-01 or DNS-01](https://letsencrypt.org/docs/challenge-types/).

### Create server config
As a next step, we'll have to create a TOML config file for Kanidm, e.g. named `server.toml`:

```toml
# server.toml

version = "2"
bindaddress = "0.0.0.0:8443"
db_path = "/data/kanidm.db"
tls_chain = "/data/cert.pem"
tls_key = "/data/key.pem"
domain = "idm.local"
origin = "https://idm.local:8443"
```

Replace `idm.local` with your actual domain name. Also, in a production setup, your IDM will likely listen on port 443, so you can skip the `:8443` part in the URL.

### Run server Docker container
We'll run Kanidm in Docker, because it's the most convenient and sort of de-facto standard way of deployment. 

```bash
docker volume create kanidm_data
docker run -d \
    --name kanidm \
    -p 127.0.0.1:8443:8443 \
    -v kanidm_data:/data \
    -v $(pwd)/server.toml:/data/server.toml:ro \
    -v $(pwd)/cert.pem:/data/cert.pem:ro \
    -v $(pwd)/key.pem:/data/key.pem:ro \
    kanidm/server
```

This creates a persistent Docker volume where Kanidm stores its database and then run the official Docker image with your config file and the TLS cert mounted into the container as [bind mounts](https://docs.docker.com/engine/storage/bind-mounts/).

Afterwards, you'll need to create the "superadmin" password for the default `idm_admin` user, which you'll later use to run CLI commands against the server.

```bash
docker exec -it kanidm kanidmd recover-account idm_admin
```

## Setup client tools
Next up, we'll have to install and configure the [client tools](https://kanidm.github.io/kanidm/stable/client_tools.html), that is, the `kanidm` CLI interface which is the official way to interact with the server (unfortunately there's no configuration web UI).

The official docs mention different ways of [installing the client tools](https://kanidm.github.io/kanidm/stable/installing_client_tools.html), depending on your OS. Unfortunately, they apparently don't just provide a static binary that you could just download and run.

Since I didn't want to include any third-party repos for my package manager (DNF on Fedora, in my case), I just pulled the statically linked `kanidm` binary from the `kanidm/tools` Docker image like so:

```bash
docker run -it --rm --name kanidm-tools kanidm/tools
docker cp kanidm-tools:/usr/sbin/kanidm kanidm  # in another terminal window
```

Feel free to use the "official" sources instead though.

Afterwards, we'll have to create the **client config** file (so `kanidm` knows which server to connect to and which cert to verify against):

```
# ~/.config/kanidm

uri = "https://idm.local:8443"
ca_path = "/home/youruser/cert.pem"  # absolute path of the tls cert created above
```

The client expects another file to be existing where it can store its session state, so create that empty file in addition:

```bash
touch ~/.cache/kanidm_tokens
```

Now we're ready to **log in** using the password we obtained above (omit the `--accept-invalid-certs` when using non-self-signed TLS certificates for your instance):

```bash
./kanidm --accept-invalid-certs login --name idm_admin
```

# OAuth 2 client setup
Now that we have a running Kanidm instance (check by navigating to https://idm.local:8443, or whatever your public URL is), we'll need to **register an OAuth 2** client for Wakapi with Kanidm.

```bash
./kanidm --accept-invalid-certs system oauth2 create wakapi "Wakapi" https://wakapi.local
./kanidm --accept-invalid-certs system oauth2 add-redirect-url wakapi https://wakapi.local/oidc/kanidm/callback
./kanidm --accept-invalid-certs system oauth2 warning-insecure-client-disable-pkce wakapi
./kanidm --accept-invalid-certs system oauth2 show-basic-secret wakapi  # note down this secret, needed later!
```

Replace `wakapi.local` with your Wakapi instance's actual domain name. The third command disables [PKCE](https://auth-wiki.logto.io/de/pkce), which is usually fine for _confidential_ (i.e. non-"public" / "server-side") clients as in the case of Wakapi. You may want to check this discussion about [_Why is disabling PKCE considered insecure?_](https://kanidm.github.io/kanidm/stable/frequently_asked_questions.html?highlight=pkce#why-is-disabling-pkce-considered-insecure) anyway, if you're interested.

Lastly, we'll **create a group** (called `wakapi-users`) that is granted permission to access Wakapi and request all [scopes](https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes) (`openid`, `email` and `profile`):

```bash
./kanidm --accept-invalid-certs group create wakapi-users
./kanidm --accept-invalid-certs system oauth2 update-scope-map wakapi wakapi-users openid email profile
```

# User management
Last step before we can move on to the Wakapi configuration is to create some actual users in the IDM and add them to the respective group. Kanidm is, again, being super strict here and doesn't just allow password-based login but requires every user to [have TOTP set up](https://kanidm.github.io/kanidm/stable/accounts/authentication_and_credentials.html#password--totp) in addition.

```bash
kanidm --accept-invalid-certs person create ferdi "Ferdi"  # replace with your preferred username
kanidm --accept-invalid-certs group add-members wakapi-users ferdi  # add user to the group
kanidm --accept-invalid-certs person credential create-reset-token ferdi  # note down the reset token
kanidm --accept-invalid-certs person credential update ferdi  # start interactive session
```

The third command brings up an interactive session to configure user credentials. In the session, do this:

1. Set up a TOTP by typing `totp` and scan the QR code with your preferred authenticator (e.g. [Aegis](https://getaegis.app/), Google Authenticator, KeePassXC, etc.)
2. Set up a password by typing `pw`
3. Save the changes by typing `commit` and `quit`

# Wakapi configuration
Finally, we can hook up Wakapi with Kanidm as an SSO provider. The following assumes you already have a running Wakapi instance (at `https://wakapi.local`, in this example), configured via the YAML configuration (e.g. mounted into the Docker container via `-v $(pwd)/config.yml:app/config.yml:ro`). If you haven't, check out the [README](https://github.com/muety/wakapi/#%EF%B8%8F-how-to-use) on how to run Wakapi.

Adapt your Wakapi config as follows:

```yaml
# config.yml

# ...
security:
    # ...
    oidc_allow_signup: true
    oidc_insecure: true  # only when using self-signed certs for debugging!
    oidc:
        - name: kanidm
          display_name: Kanidm
          client_id: wakapi
          client_secret: <your secret>  # obtained from the command above
          endpoint: https://idm.local:8443/oauth2/openid/wakapi
# ...
```

Again, replace `idm.local:8443` with your actual Kanidm public URL. The `wakapi` suffix in the `endpoint` URL corresponds to the name of your OAuth 2 client created above.

After restarting Wakapi, it will now give you the option to use Kanidm for SSO.

![](images/wakapi_kanidm_login1.webp)
![](images/wakapi_kanidm_login2.webp)

This blog post was partially inspired by [_From Keycloak to Kanidm_](https://ashhhleyyy.dev/blog/2023-02-05-from-keycloak-to-kanidm).
