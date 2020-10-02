---
title: Migrating Nextcloud from SQLite to MySQL with Docker
date: 2020-10-02 18:05:15
tags:
---

# Introduction
I bet there are a ton of tutorial like this out there already and also the Nextcloud documentations are brilliant themselves. However, I want to quickly document the process of migrating a Nextcloud 19 instance from SQLite to MySQL as a database backend.

Please refer to the [official guide](https://docs.nextcloud.com/server/18/admin_manual/configuration_database/db_conversion.html) for further information.

# Setup
My starting situation is two existing, running Docker containers, one for Nextcloud ([`nextcloud:19`](https://hub.docker.com/_/nextcloud)) and one for a MySQL server ([`mysql:5.7`](https://hub.docker.com/_/mysql)), which I also use for other applications as well. 

```
$ docker ps

3bea098afb11        nextcloud:19                 "/entrypoint.sh apac…"   6 weeks ago         Up 7 days           127.0.0.1:9000->80/tcp                      nextcloud
a140a0ba21d3        mysql:5.7                    "docker-entrypoint.s…"   11 months ago       Up 8 days           127.0.0.1:3306->3306/tcp, 33060/tcp         mysql
```

# Migrating
## Creating a new database
First, a new database is needed, which can later be filled by Nextcloud. To do so, use the `mysql` command-line client provided by the Docker container to interactively create a new database and a corresponding user. 

```bash
$ docker exec -it nextcloud mysql -u root -p;
```

After typing your `root` password, you're logged in to the interactive SQL console. Run the following queries.

```sql
CREATE DATABASE 'nextcloud';
CREATE USER 'nextcloud_user'@'%' IDENTIFIED BY 'some-secret-password';
GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextcloud_user'@'%';
ALTER DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
FLUSH PRIVILEGES;
```

As Nextcloud's docs say, you need to explicitly [enable MySQL 4-byte UTF-8 support](https://docs.nextcloud.com/server/18/admin_manual/configuration_database/mysql_4byte_support.html). This is done by the last of the above queries.

## Configuring a Docker network
If you are using Docker, your Nextcloud container needs a way to talk to your database container. To enable this, they both need to be in the same virtual network. The following shows how to create a new network (called `mysql`) and join both containers to it.

```bash
$ docker network create mysql
$ docker network connect mysql mysql
$ docker network connect mysql nextcloud
```

Assuming the database container has the name `mysql`, like in this example, the Nextcloud container can now reference through simply using `mysql` as a DNS name.

## Migrating data
As part of the second steps, Nextcloud's excellent `occ` command-line tool comes to play. It essentially does all the heavy lifting for you. Simply follow these steps.

Note: If you are not using Docker, but a native Nextcloud installation, simply leave out the `docker exec` command and run `php occ` directly.

First, we want to turn maintenance mode on, to "freeze" the data.
```bash
$ docker exec -it -u www-data nextcloud php occ maintenance:mode --on
```

Next, we need to do the server-side part of the above mentioned migration to 4-byte UTF-8 support.
```bash
$ docker exec -it -u www-data nextcloud php occ config:system:set mysql.utf8mb4 --type boolean --value="true"
$ docker exec -it -u www-data nextcloud php occ maintenance:repair
```

Now, we can perform the actual migration from SQLite to MySQL. This may take a while, depending on the size of your database. Luckily, mine was only about 27 MB in size.

```bash
$ docker exec -it -u www-data nextcloud php occ db:convert-type --all-apps --clear-schema mysql nextcloud_user mysql nextcloud
```

Eventually, turn off maintenance mode again.
```bash
$ docker exec -it -u www-data nextcloud php occ maintenance:mode --off
```

If everything went well, Nextcloud has updated its own config to use the MySQL database instead of SQLite. You can check this at http://your-nextcloud-server.tld/settings/admin/serverinfo.

![](https://apps.muetsch.io/images/o:auto/?image=https://muetsch.io/images/nextcloud_migration.png)

# Conclusion

The above process helped me – thanks to the great tooling and documentation provided by the Nextcloud community – to migrate my Nextcloud instance from the "slow" SQLite database engine to MySQL. I hope it works for you as well.

Good luck!

# P.S.
Please keep in mind that the start command for your Nextcloud container is different now. For instance, if you want to update your container, you have to pass different parameters than before. Here is what works for me:

```bash
$ docker run -d -v /var/data/nextcloud:/var/www/html -v /var/data/nextcloud/data/:/var/www/html/data -p 127.0.0.1:9000:80 --network mysql -e MYSQL_DATABASE=nextcloud -e MYSQL_USER=nextcloud_user -e MYSQL_PASSWORD=iwonttellyouthis -e MYSQL_HOST=mysql --name nextcloud nextcloud:19
```

(An even better practice would be to not use file system mounts but actual Docker volumes here.)