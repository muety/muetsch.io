---
title: Speeding up my MySQL database dump / restore by ~10x
date: 2026-03-01 08:27:30
tags:
---

My favorite side-project [Wakapi.dev](https://wakapi.dev/) runs on MySQL and since we have more than 4,200 registered users today (thank you all! 🙏), the database size has grown to almost 34 GB. Accordingly, restoring a database dump from backup is quite time-consuming. In fact, it used to take **almost 10 hours** until recently. The following is a brief rundown of how I sped this up to just barely more than **1.5 hours** – just because I'm so excited by this simple change.

# The naive way
The naive, old-fashioned way of dumping and restoring a MySQL database is to use the [`mysqldump`](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html) utility in combination with the plain `mysql` command-line client.

```bash
# dump the database
mysqldump -u wakapi_user -p --single-transaction --skip-lock-tables --opt --databases wakapi | gzip > wakapi.sql.gz

# restore it from dump
(echo "set session unique_checks=0; set session foreign_key_checks=0; set session autocommit=0;"; zcat [backup_name].sql.gz; echo "COMMIT;") | mysql -u wakapi_user -p wakapi
```

This already includes some "performance tweaks", like skipping foreign key checks during import, but nevertheless is super slow. Restoring the database this way ran for almost 10 hours on my computer, while CPU and SSD were pretty much idling most of the time. The reason is that the above command restores the SQL file **line by line** in a **sequential** way, that is, it runs **single-threaded**.

# My "brilliant" idea to speed this up
I was thinking about a way to speed this up, especially to run at least parts of the import in parallel. If Postgres' [`pg_restore`](https://www.postgresql.org/docs/current/app-pgrestore.html) can be so much faster, why can't we? My idea involved two "optimizations":

1. Use **batch-wise `INSERT`** statements for rows of the same structure. That is, don't insert rows of the same table one by one, use multi-valued insert queries. 
    * **Note:** Later, I learned that this is probably exactly what `mysqldump`'s `--extended-insert` flag does
2. Use multiple **concurrent connections**. Instead of establishing a single connection to the database, open multiple and run inserts in parallel, as long as they don't depend upon each other.

Of course, to enable for the second option, you'd first need to identify interdependencies between tables. If table A references table B in a foreign key relation, table B would have to be loaded before A. However, in a naive implementation, you could simply "order" the tables by how they depend on each other and only parallelize within the same "hierarchy" level of that dependency tree.

For example, given the database schema of Wakapi, pretty much all relations depend on the `users` table, so that one would have to be created first.

![Wakapi database schema diagram](images/wakapi_db_schema.webp)

Totally committed to implementing such a "revolutionary" backup restore tool for MySQL databases, I was already researching on SQL query parsers (such as [JSqlParser](https://jsqlparser.github.io/JSqlParser/)) that I could use to realize the above-mentioned logic.

Then I found that modern versions of MySQL (>= 8.0) already feature pretty much exactly this functionality as part of [**MySQL Shell**](https://dev.mysql.com/doc/mysql-shell/8.0/en/).

# The modern way using MySQL Shell
This article on [_Multithreaded Data Dumps With MySQL Shell_](https://blogs.oracle.com/mysql/multithreaded-data-dumps-with-mysql-shell) illustrates the whole magic. The MySQL Shell is a "new" interface to MySQL in addition to the plain, old `mysql` CLI tool and features a bunch of new functionality that can be called via a **JavaScript** or **Python** API.
Specifically, it comes with amazing tools for dumping and restoring individual **tables**, entire **databases** or even the whole server **instance**:

* `util.dumpTables()`
* `util.dumpSchemas()`
* `util.dumpInstance()`

For restoring, there's a single `util.loadDump()` method.

Both dumping and restoring work in a **multi-threaded** fashion, utilizing pretty much the above logic (plus many more smart tweaks and tricks).

Long story short, I refactored by backup + restore pipeline to this:

```bash
# dump the database (or multiple, if wanted)
mysqlsh -uwakapi_user -p --js -e "util.dumpSchemas(['wakapi'], '/backup/wakapi.dump', {threads: 8})"

# restore database
mysql -u wakapi_user -p -e "set global local_infile = 'on';"  # see https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_local_infile
mysqlsh -uwakapi_user -p --js -e "util.loadDump('/backup/wakapi.dump', {schema: 'wakapi', threads: 8, resetProgress: true, skipBinlog: true, deferTableIndexes: 'all'}"
```

The `skipBinlog` parameter prevents the target MySQL server from writing [binary logs](https://dev.mysql.com/doc/refman/8.4/en/binary-log.html) for all queries (which would pointlessly "duplicate" all data already included in the dump once again) and `deferTableIndexes` instruct the server to not update table indexes "line by line", but in a batch-wise fashion _after_ the import itself had run.

The dump created by `dumpSchemas()` exists in form of a local directory that consists of a series of compressed data- and metadata files for every table. By default, `zstd` compression is used, but you can opt for `gzip` or `none` using the `compression` parameter.

```
ferdinand@wakapi:~/backup/data/wakapi.dump$ ls -al
total 3453984
drwxr-x--- 2 wakapi wakapi    90112 Mar  1 00:12 .
drwxr-xr-x 9 wakapi wakapi     4096 Mar  1 00:10 ..
-rw-r----- 1 wakapi wakapi    34154 Mar  1 00:12 @.done.json
-rw-r----- 1 wakapi wakapi      869 Mar  1 00:10 @.json
-rw-r----- 1 wakapi wakapi      237 Mar  1 00:10 @.post.sql
-rw-r----- 1 wakapi wakapi      237 Mar  1 00:10 @.sql
-rw-r----- 1 wakapi wakapi    21153 Mar  1 00:10 wakapi@aliases@@0.tsv.zst
-rw-r----- 1 wakapi wakapi        8 Mar  1 00:10 wakapi@aliases@@0.tsv.zst.idx
-rw-r----- 1 wakapi wakapi      673 Mar  1 00:10 wakapi@aliases.json
-rw-r----- 1 wakapi wakapi     1017 Mar  1 00:10 wakapi@aliases.sql
-rw-r----- 1 wakapi wakapi     1512 Mar  1 00:10 wakapi@api_keys@@0.tsv.zst
-rw-r----- 1 wakapi wakapi        8 Mar  1 00:10 wakapi@api_keys@@0.tsv.zst.idx
-rw-r----- 1 wakapi wakapi      670 Mar  1 00:10 wakapi@api_keys.json
-rw-r----- 1 wakapi wakapi      933 Mar  1 00:10 wakapi@api_keys.sql
-rw-r----- 1 wakapi wakapi      673 Mar  1 00:10 wakapi@database_sizes.pre.sql
-rw-r----- 1 wakapi wakapi     1381 Mar  1 00:10 wakapi@database_sizes.sql
-rw-r----- 1 wakapi wakapi   736446 Mar  1 00:10 wakapi@diagnostics@@0.tsv.zst
-rw-r----- 1 wakapi wakapi      376 Mar  1 00:10 wakapi@diagnostics@@0.tsv.zst.idx
-rw-r----- 1 wakapi wakapi      742 Mar  1 00:10 wakapi@diagnostics.json
-rw-r----- 1 wakapi wakapi      839 Mar  1 00:10 wakapi@diagnostics.sql
-rw-r----- 1 wakapi wakapi  4461276 Mar  1 00:10 wakapi@durations@0.tsv.zst
-rw-r----- 1 wakapi wakapi      376 Mar  1 00:10 wakapi@durations@0.tsv.zst.idx
-rw-r----- 1 wakapi wakapi  5016757 Mar  1 00:10 wakapi@durations@10.tsv.zst
-rw-r----- 1 wakapi wakapi      416 Mar  1 00:10 wakapi@durations@10.tsv.zst.idx
```

# Conclusion
Restoring Wakapi's 34 GB large database sped up from having to run overnight to barely taking 1 1/2 hours by switching from the old, naive `mysqldump` approach to the more modern `mysqlsh` way. I'm simply amazed by this and will advocate for this technique as the go-to way for MySQL backups.
