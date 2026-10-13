---
title: How to backup SharePoint with rclone and borg
date: 2026-10-13 14:11:36
tags: [sysadmin, linux]
---

# Intro
This is a short guide on how to backup corporate Microsoft SharePoint document libraries (that is, all "folders" you'll typically find under _Quick access_ at `https://yourcompany-my.sharepoint.com/`) using [Borg](https://borgbackup.readthedocs.io). In particular, [rclone](https://rclone.org) will be responsible for one-way, read-only syncing your SharePoint files to local disk, from where borg backups them to an encrypted remote repo (SFTP / SSH in this example). Goal is to have a periodic job running on some server, NAS, RaspberryPi, etc. to backup all of your company's SharePoint to a target that you're in control of. This article builds on [this blog post](https://blog.ssb-tech.net/posts/using-rclone-for-sharepoint-online/) and the official rclone [docs](https://rclone.org/onedrive/#using-oauth-client-credential-flow) for OneDrive.

# Prerequisites
First of all, you'll have to be a **_Global Administrator_** within your Microsoft / Entra organization. Check this under [Roles & admins](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/RolesManagementMenuBlade/~/AllRoles) in the Entra admin center.

Despite that, you'll need a machine to run the backups from, which has enough storage space to fit your entire SharePoint library (we'll use actual file syncs instead of virtual FUSE mounts).

Lastly, you'll have to have `borg` and `rclone` installed. When on Debian, Ubuntu or many other Linux distros, the officially packaged `rclone` is awefully outdated though (v1.60.1 from 2022 while I write this) and even the [official docs](https://rclone.org/install/#package-manager) recommend to install via the downloadable `.deb` / `.rpm` or standalone binary instead.

# Entra OAuth app registration
We're going to use the **client credentials flow** for rclone to authenticate against SharePoint. This comes at the benefit that rclone will use permissions directly associated with the Azure AD Enterprise application, instead of running "on behalf" of a user account. This way, the backup script is agnostic of any user's identity.

## Create an enterprise app
Log in to the [Entra admin center](https://entra.microsoft.com) and browse to _Enterprise apps_. Create a new application and choose _"Register an application to integrate with Microsft Entra ID"_ for it.

![](images/sharepoint-rclone-borg-01.png)

![](images/sharepoint-rclone-borg-02.png)

Make it support the _"Single tenant only"_ account type and configure `http://localhost:53682` as a _Web_-type redirect URL.

![](images/sharepoint-rclone-borg-03.png)

Go to _Overview_ and copy the application / **client ID** and the directory / **tenant ID** for later.

![](images/sharepoint-rclone-borg-04.png)

(btw., this is not my real client ID, I changed it for the screenshot)

## Create an OAuth client secret
Second, go to _App registrations_ in the left-hand side main menu, choose your newly created app from the list and go to _Certificates & secrets_.

![](images/sharepoint-rclone-borg-05.png)

Create a new client secret (**important:** copy the secret's value for later, you'll not get a second chance) and choose the following _Application permissions_ (important: **not** _Delegated permissions_) under "Microsoft Graph API" for it:

![](images/sharepoint-rclone-borg-06.png)

* `Files.Read.All`
* `Files.ReadWrite.All` (probably not even needed, not sure though)
* `Sites.Read.All` (for finding the `drive_id` later)
* `User.Read`

Lastly, hit _"Grant admin consent for ..."_.

![](images/sharepoint-rclone-borg-07.png)

# Set up rclone
You can either walk through the interactive rclone CLI (`rlone config` -> _New_ -> "Microsoft OneDrive (ID 42)", ...) or edit the config directly. I'll explain the latter here.

## Configure the remote
1. Create the rclone config folder if not yet existing:
    ```bash
    mkdir -p ~/.config/rclone
    ```
2. Create (or edit the existing) config file at `~/.config/rclone/rclone.conf` and paste the following contents:
    ```toml
    [sharepoint-mydocs]
    type = onedrive
    client_id = <your-application-id>
    client_secret = <your-client-secret>
    tenant = <your-tenant-id>
    client_credentials = true
    drive_type = documentLibrary
    access_scopes = Files.Read Files.Read.All Sites.Read.All offline_access
    ```
3. Replace the `client_id` with the application ID you copied for your newly created enterprise app earlier
4. Replace the `tenant` with the directory / tenant ID from the that same overview page (blurred in my screenshot above)
5. Replace the `client_secret` with the secret value you copied right after you created it
6. Obtain your document library's drive ID
    1. Run a reconnect command
        ```bash
        rclone config reconnect sharepoint-mydocs:
        ```
    2. Choose option (4) (_"Search for a Sharepoint site"_)
    3. In the search field, search for the name of your document library / Team (e.g. sth. like "My Docs", "Marketing", "Development", etc.) 
    4. Proceed with the interactive wizard to eventually obtain the `drive_id` (will be added to your config)

    ![](images/sharepoint-rclone-borg-08.png)

If everything worked, you'd should be able to list your documents now:
```bash
rclone ls sharepoint-mydocs:
```

## Run a sync
You may now want to run a one-time sync of all of your documents, for example to a local folder at `~/SharePoint/My Docs` (create it first).

```bash
rclone sync sharepoint-mydocs: "$HOME/SharePoint/My Docs" --ignore-checksum --ignore-size -P
```

You may not need `--ignore-checksum` and `--ignore-size`, but I did – due to a known [issue](https://github.com/OneDrive/onedrive-api-docs/issues/935#issuecomment-441741631) with the OneDrive API.

# Set up borg
This guide assumes your backup target is an SSH host, such as a [Hetzner Storage Box](https://docs.hetzner.com/storage/storage-box/), some remote NAS or the like.

1. Initialize a new repo
    ```bash
    borg init -e repokey ssh://your-backup-host/sharepoint-backup
    ```
    This requires to choose a passphrase, which is used to encrypt the repo encryption key. Make sure to remember this and keep it safe in your password manager!
2. Export the key
    Very important: export your repo key (store it in your password manager or somewhere secure), otherwise you'll loose access to your backups.
    ```bash
    borg key export ssh://your-backup-host/sharepoint-backup > .borg_key
    cat .borg_key  # now copy it!
    rm .borg_key
    ```
3. Create a file for your passphrase (so backups can run non-interactively as a scheduled job later)
    ```bash
    echo "your-key-passphrase" > .borg_passphrase
    chmod 600 .borg_passphrase
    ```
4. Validate repo access (check if stuff works)
    ```bash
    BORG_PASSCOMMAND="cat .borg_passphrase" borg list ssh://your-backup-host/sharepoint-backup
    ```

# Create backup script
We'll use the following script to run an rclone sync, followed by a borg backup automatically. Create it, for example, at `~/backup_sharepoint.sh`.
```bash
#!/bin/bash
export BORG_PASSCOMMAND="cat $HOME/.borg_passphrase"

set -Eeuo pipefail  # stop after any command failing

LOG_FILE="${LOG_FILE:-$HOME/sharepoint-backup.log}"
LOCK_FILE="${LOCK_FILE:-/var/lock/sharepoint-backup.lock}"

exec >>"$LOG_FILE" 2>&1  # log to file
exec 9>"$LOCK_FILE"  # no overlapping runs
flock -n 9  # skip if lock is held

rclone sync sharepoint-mydocs: "$HOME/SharePoint/My Docs" --ignore-checksum --ignore-size --log-file ~/rclone.log
# you may add additional sharepoint sources here (configure rclone analogously)

borg create --stats ssh://your-backup-host/sharepoint-backup::{now} $HOME/SharePoint
borg prune --keep-daily 7 --keep-weekly 4 --keep-monthly 12 ssh://your-backup-host/sharepoint-backup
```

You may add email notifications to this script if you want (leave a comment if interested in details).

Lastly, create a cron job that runs the script every night.

1. Run `crontab -e`
2. Paste a cron command like this:
    ```cron
    30 1 * * *  /bin/bash $HOME/backup_sharepoint.sh  # at 1.30 am
    ```

Good luck!
