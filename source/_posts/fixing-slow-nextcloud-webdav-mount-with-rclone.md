---
title: Fixing slow Nextcloud WebDAV mount with rclone
date: 2025-06-29 13:45:24
tags: [sysadmin, linux]
---

After Nextcloud broke the Linux desktop client for NTFS filesystems (see [#7613](https://github.com/nextcloud/desktop/issues/7613)), I tried to switch from syncing my folders to simply mounting them via WebDAV. On Linux, the [official](https://docs.nextcloud.com/server/latest/user_manual/en/files/access_webdav.html) to accomplish this uses the [`davfs2`](https://wiki.archlinux.org/title/Davfs2) driver. Unfortunately, due to some long-lasting issue with that driver, directory listings are [unbearably](https://help.nextcloud.com/t/webdav-extremely-slow-on-linux-using-davfs2-mount/123811) [slow](https://github.com/nextcloud/server/issues/32729), though. Different mount options or driver parameters (like adapting caching- and locking behavior, etc.) didn't help for me.

Eventually, I found a good solution, which uses [rclone](https://rclone.org/) in place of the `davfs2` FUSE driver for the mount. Apparently, their [WebDAV implementation](https://github.com/rclone/rclone/blob/master/backend/webdav/webdav.go) is more robust and has better performance (orders of magnitude faster in my case), at least in case of a Nextcloud remote. While rclone's primary purpose is backups, it is well suitable for my very simple use case as well. Besides common storage services like S3, Google Cloud Storage, Dropbox and [countless](https://github.com/rclone/rclone?tab=readme-ov-file#storage-providers) others, rclone has a [WebDAV backend](https://rclone.org/webdav/), which allows to create a local mount point from a WebDAV resource. Here is how:

## Setup
1. **[Install](https://rclone.org/install/)** rclone
1. [Configure](https://rclone.org/webdav/#configuration) a **new remote** for Nextcloud WebDAV
1. **Mount it manually** (to verify things are working)
    ```bash
    rclone mount nextcloud: /mnt/nextcloud --vfs-cache-mode full
    ```

    Note: Your mount point can vary from `/mnt/nextcloud`, of course.

1. Create a **systemd service** for auto-mounting
    1. Create a new file at `/etc/systemd/system/rclone-nextcloud.service`
        ```
        [Unit]
        Description=RClone mount for Nextcloud
        Documentation=man:rclone(1)
        After=network-online.target
        Wants=network-online.target
        AssertPathIsDirectory=/mnt/nextcloud

        [Service]
        Type=simple
        User=your-username
        Group=your-groupname
        ExecStart=/usr/bin/rclone mount nextcloud: /mnt/nextcloud \
            --config=/home/your-username/.config/rclone/rclone.conf \
            --vfs-cache-mode full \
            --vfs-cache-max-age 1h \
            --vfs-cache-max-size 1G \
            --buffer-size 16M \
            --dir-cache-time 72h \
            --umask 002 \
            --uid 1000 \
            --gid 1000 \
            --daemon-timeout 30s
        ExecStop=/bin/fusermount -u /mnt/nextcloud
        TimeoutStartSec=60
        TimeoutStopSec=20
        KillMode=process
        Restart=on-failure
        RestartSec=30
        StartLimitInterval=300
        StartLimitBurst=3

        [Install]
        WantedBy=multi-user.target
        ```

        **Important:** Replace `your-username` and `your-groupname` by your actual user- and group names and adapt `uid` and `gid` accordingly. Also, feel free to experiment with different [VFS caching options](https://rclone.org/commands/rclone_mount/#vfs-virtual-file-system). 

    1. Start the service and enable it for being executed during startup
        ```bash
        sudo systemctl daemon-reload && \
        sudo systemctl start rclone-nextcloud.service && \
        sudo systemctl enable rclone-nextcloud.service

Note that if you're using a custom DNS resolver (like [dnscrypt-proxy](https://github.com/DNSCrypt/dnscrypt-proxy) in my case) or anything else that must be running _before_ your Nextcloud remote can be reached, you'll have to adapt the `After=` and `Wants=` options.