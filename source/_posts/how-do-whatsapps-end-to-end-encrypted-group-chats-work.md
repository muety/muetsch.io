---
title: How do WhatsApp’s end-to-end encrypted group chats work?
date: 2016-04-07 22:56:43
tags:
---

![WhatsApp_Logo](/images/whatsapp_logo.png)

A few days ago WhatsApp has announced end-to-end encryption for all chats, which basically means, that messages are encrypted in a way that nobody except for the recipient can read a message. Previously only the communication channels between you and the server and between the server and your chat partner were encrypted, but the messages lay in clear text form on the server (though in case of WhatsApp not persistently stored).  
Every end-to-end encryption is based on asymmetric cryptography methods, where a private and a public key exist. Messages encrypted with the public key can only be decrypted using the respective private key and the other way round. The private key is always kept private (as the name implies) and should never ever leave the user’s device, while the public key is sent to every chat partner, who will use it for messages addressed to you. No one without your private key will every be able to read them. In turn you are in posession of your chat partners’ public keys to send secure messages to them. So far so good, but there’s a problem with group chats.  
Assume a group with three members, you (A), B and C. B (C) can only read messages signed with pubkey_B (pubkey_C). This would mean you had to encrypt the message twice, once with each public key. As a consequence you would also have to send it twice, which make your traffic for group messaging increase linearly with the amount of group members. Traditionally you only had to send the exact same message to the server once, who then did a fanout to all group members. Now you would have to send x (number of group members) different (since differently encrypted) messages, which isn’t a too good solution, since it will increase your mobile data traffic amount. [Threema does it that way anyway](https://threema.ch/press-files/cryptography_whitepaper.pdf). WhatApp takes another approach that I will explained a little simplified.

According to their [Whitepaper of crypthography](https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf) it works roughly as follows:  
1\. When joining a group you generate a group-specific key-pair, which we call myGroupPubkey and myGroupPrivkey from now on.  
2\. You encrypt it individually with every other group member’s public key (similar as you would do with a normal message) and send it to them. This is a client-side fanout where you actually send as many messages as there are members in the group, but it’s acceptable since it only happens once when joining a new group, not every time sending a message.  
3\. The partners encrypt this key-message using their respective private keys and get your myGroupPubkey out.  
4\. You encrypt every subsequent message using myGroupPrivkey (note that traditionally you encrypt messages using the partner’s public key while now you encrypt them using your private key) and send it to the server (who can’t read it) to fan it out to the group.  
5\. Every group members uses your myGroupPubkey to decrypt is.

It is important to note that you encrypt with your private key, which it is usually not intended for (biut technically perfectly capable of), since it is unsecure in the way that everyone with your public key could read the message payload. The sticking point is that since this public key is transferred in asymmetrically encrypted form it is safe that only group members are in possession of it. If a group changes, those keys are re-generated.

To be precise, this is only a simplified description but it explains the fundamental concept. For instance, besides other technical details the messages are actually first encrypted symmetrically and then signed asymmetrically.

Disclaimer: There is no guarantee for correctness of this explanation at all. This is how I have understood the process, but that doesn’t mean it is actually true. Do not rely on this. If you’re from a cryptographical background, have read the official Whitepaper and are of the opinion that I understood anything from please let me know.