---
title: PGP-encrypted personal e-mail inbox
date: 2020-09-29 19:18:33
tags:
---

![](https://apps.muetsch.io/images/o:auto/rs,s:640/?image=https://muetsch.io/images/lock.jpg)

# Introduction
Most instant messengers today, including WhatsApp, Signal, Telegram, Threema, Wire and others, support end-to-end encryption (E2EE) of text messages. In fact, messengers that don't support E2E encryption are usually considered dubious. However, when it comes to e-mails, things are mostly still quite insecure – even in 2020. 

The majority of personal- and business-related e-mails are still sent as plain text (however, at least encrypted in transit [[1]](https://transparencyreport.google.com/safer-email/overview?hl=en&encrypt_region_table=encryption_level:RED,YELLOW,GREEN;region:001&lu=encrypt_region_table) mostly). A major reason is the fact that PGP (e.g. with [OpenPGP](https://www.openpgp.org/)) is still quite cumbersome to set up and use for non-technical people. Morever, [PGP has some issues](https://saltpack.org/pgp-message-format-problems), however, some kind of encryption is usually better than none at all. 

If you want to learn more about E2EE for e-mails, I recommend [this article](https://protonmail.com/blog/what-is-end-to-end-encryption/) by ProtonMail. However, E2EE is not particularly the topic of this post.

# Inbox encryption
While true end-to-end-encrypted communication requires both parties to have a working PGP setup and is therefore impractical to realize without cooperation, you can at least boost your e-mail security to a certain extent by encrypting your own inbox. That is, mails are stored on the server encryptedly and can, at least, not be read by a malicious attacker and – depending on the implementation – potentially not even by your mail provider. In the following, I want to present the setup with which I realized my personal, encrypted inbox.

## My setup
First of all, I do not host my own mail server (I used to, but maintining such turned out to be almost a full-time job!), but rely on an external provider. In my case, this provider is **[mailbox.org](https://mailbox.org)**, which I can absolutely recommend to anyone. It offers an intuitive webmail, a ton of expert-level configuration options, the ability to bring your own domain, German storage locations and a lot more. Also, they claim to care a lot about [privacy](https://kb.mailbox.org/display/MBOKBEN/Can+I+trust+the+staff+at+mailbox.org) and the founder, [Peer Heinlein](https://de.wikipedia.org/wiki/Peer_Heinlein), is both the author of a collection of e-mail technology-related literature and an active supporter of open-source and / or creative commons projects like the Wikimedia foundation. Other PGP-capable e-mail providers include [ProtonMail](https://protonmail.com/) and [Posteo](https://posteo.de/en). 

[![](https://apps.muetsch.io/images/o:auto/rs,s:150/?image=https://muetsch.io/images/mborg_logo.jpg)](https://mailbox.org)


Mailbox.org supports different kinds of PGP-based encryption, one of them being the "[mailbox.org Guard](https://kb.mailbox.org/m/mobile.action#page/1181454)". In essence, this feature provides server-side encryption of everything inside your inbox using customer-provided PGP keys. While server-side encryption still requires you to trust your provider, I consider it a good compromise between security and still having an intuitive, almost seemless user experience. 

[![](https://apps.muetsch.io/images/o:auto/rs,s:100/?image=https://muetsch.io/images/tb_logo.png)](https://thunderbird.net)

Apart from the webmail client I use open-source **[Thunderbird](https://thunderbird.net)** as my desktop e-mail client. In combination with the Enigmail extension, integration with mailbox.org's PGP encryption is set up almost trivially. More recent version of Thunderbird even have built-in PGP support. Each time I want to access my inbox from Thunderbird, I am prompted to enter my PGP key's passphrase. You can also save the key to your operating system's key store, so you don't have to enter it repeatedly.

<div style="display: flex; justify-content: space-evenly">
    <a href="https://k9mail.app" style="background: none"><img src="https://apps.muetsch.io/images/o:auto/rs,s:100/?image=https://muetsch.io/images/k9_logo.png"/></a>
    <a href="https://openkeychain.org" style="background: none"><img src="https://apps.muetsch.io/images/o:auto/rs,s:100/?image=https://muetsch.io/images/okc_logo.png"/></a>
</div>

The last missing piece is the ability to read mails from my Android phone as well. Setting that up was a little more complicated as most e-mail clients on Android do not include support for encryption – except for the excellent, fully open-source [K-9 Mail](https://k9mail.app/) client. It integrates with [OpenKeychain](https://www.openkeychain.org/) – a general-purpose, open-source PGP provider for Android. The setup involves to import your PGP keys to OpenKeychain and link it to K-9. Afterwards, it works completely seemless as well. Only when your phone was restarted you are requrired to enter your key's passphrase.

# Conclusion
My intension with this article is to present a working, easy-to-use tech stack for inbox encryption, solely based on open-source software to eventually encourage more people to think about using encryption more extensively. Give it a try!