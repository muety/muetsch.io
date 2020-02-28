---
title: Instant messenger security / encryption overview
date: 2016-02-01 22:48:46
tags:
---

---

**[Update: Feb 28, 2020]**
This post is quite old now and things change rapdily, so please keep in mind that it might not be 100 % accurate anymore. Therefore, I would like to refer to a more recent article on [The best encrypted messaging apps (and their limitations) in 2020](https://www.comparitech.com/blog/information-security/best-encrypted-messaging-apps/). Also, there was a very interesting discussion about [Why do instant messengers not simply use PGP?](https://www.reddit.com/r/crypto/comments/f87asa/why_do_instant_messengers_not_simply_use_pgp/), that helps to better understand the topic of secure messaging.

---

I found a very nice page showing an overview of the security features of almost any instant messenger available. Nowadays where digital privacy observation is on everyones lips it is really interesting to see in how far the messengers we use every day are actually secure and who can potentially read or messages or not.

[![](/images/scorecard.jpg)](https://www.eff.org/pages/secure-messaging-scorecard)

The aspects “Encrypted in transit?” and “Encrypted so the provider can’t read it?” are probably the most important ones and are a different way of saying if the application uses encrypted transmission (probably HTTPS for the most cases) and if it has end-to-end encryption. The last one means that keys are exchanged between sender and recipient which are used for asynchronous encryption so that nobody who potentially receives the message in the middle between them could read it – neither the provider nor the government. To prove that this is actually implemented properly it is required to have an open code which can be reviewed by anyone, because if nobody has ever seen the code it could potentially be the case that your messenger might use end-to-end encryption but the provider grabs your private key too or things the like.

What I miss about this “Secure Messaging Scorecard” is a specification of whether images (and audio recordings, videos, …) get encrypted, too, by messengers that have a checkmark in the second column. Maybe I will do some research on this for some of the listed messengers.

What I find alarming is that some commonly used apps like Skype don’t even have end-to-end encryption – it is not that hard to integrate and for me this should be standard today. I don’t care that extremely much about online privacy because eventually I don’t have anything to hide but anyhow – why should Microsoft employees potentially be able to read my messages and view my pics?