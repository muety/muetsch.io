---
title: Migrate Maildir to new server using imapsync
date: 2016-07-23 23:01:44
tags:
---


This is a little tutorial for mailserver administrators, who want to *migrate* to a new server while *keeping all e-mails*. This works for mailservers whose MDA uses the [Maildir](https://en.wikipedia.org/wiki/Maildir) format – like Dovecot by default – and have *IMAP* enabled.  
This tutorial does *not* cover how to set up and configure a new mailserver on a new machine, based on the old one’s configuration, but only how to migrate the e-mails. Simply *tar*ing the Maildir folder and un_tar_ing it on the new machine again usually won’t work. But don’t worry, there is a cleaner way that abstracts away any actual mailserver or file-level considerations by only using the IMAP protocol’s methods. Therefore, we use a tool *imapsync*, which is written Perl. It acts as an ordinary IMAP client – just as Outlook or Thunderbird – that connects to both mailservers, the old and the new one. All information needed is how to authenticate the respective user with both servers. Actually one “manual” way to migrate the mails would be to set up both mail accounts in Outlook or Thunderbird, let download the mails via IMAP from the old one and Ctrl+A and Drag&Drop them over to the new one. imapsync does just that – yet automatically and without Outlook or Thunderbird.

First we need to *install imapsync*. You could install imapsync on your local PC, just as you would with Outlook or Thunderbird, but then there would be a unnecessary detour from server 1 over your PC to server 2\. And since your local internet connection is probably ways slower then the servers’, your PC would be a bottleneck. So I recommend to install imapsync on either the old or the new mailserver’s host machine. Let’s do it.

1.  Clone the imapsync repository to any folder on your machine, e.g. `/opt/imapsync`: `git clone https://github.com/imapsync/imapsync`

2.  Read the installation notes for your specific operation system at [https://github.com/imapsync/imapsync/tree/master/INSTALL.d](https://github.com/imapsync/imapsync/tree/master/INSTALL.d) and do exactly what’s described there. Usually, you will need to install some dependencies and the like.

3.  Now you should be able to execute `./imapsync` from within the directory where you have cloned it to, e.g. `/opt/imapsync`. You should see a description on how to use the program.

Let’s now assume that you want to migrate mails from your old server with ip *12.34.45.78* for user “*foo@example.org”* with password “*suchsecret”* to your new server with ip *98.76.54.32*. A prerequisite is that on both machines the mailserver is up and running and the respective user is configured. Further, let’s assume that on the new machine the user, as it makes sense, is called “*foo@example.org”* again, but his password is “*ssshhhhh”* now and that both MDAs require a *TLS*-secured connection, use standard *PLAIN* login method and are listening on *port 143*.

To perform the migration now, run the following command:

```bash
./imapsync --host1 12.34.45.78 --user1 foo@example.org --password1 suchsecret --authmech1 PLAIN --tls1 --host2 98.76.54.32 --user2 foo@example.org --password2 ssshhhhh --authmech2 PLAIN --tls2
```

Now all mails should be transferred from `host1` through the imapsync client to `host2`, using nothing but the IMAP protocol. If you want to test if everything is working fine first, before actually transferring data, you could add the `--dry` option to the above command.

To migrate multiple accounts at once, you could write a small scripts that takes username-password combinations from a text file, as described here: [https://wiki.ubuntuusers.de/imapsync/#Massenmigration](https://wiki.ubuntuusers.de/imapsync/#Massenmigration) (although that article is in German, the code should be clear).