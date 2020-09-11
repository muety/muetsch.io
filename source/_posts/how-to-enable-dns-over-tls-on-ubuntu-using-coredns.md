---
title: How to enable DNS-over-TLS on Ubuntu using CoreDNS
date: 2020-04-11 20:41:57
tags:
description: This article describes, how to browse the web more privately using DNS-over-TLS. Therefore, it is shown how to set up CoreDNS on a Ubuntu machine.
---

# Privacy on the Web
Luckily, most traffic on the web is encrypted today, which means nobody between your computer and the web server knows what you are sending or receiving. This includes your internet service provider (ISP), any kind of government agency or a potential attacker on your network. Since the entire HTTP packet, including its headers, is encrypted, they will not even see what website you are visiting. At least not for sure. What they can see is the target web server's IP address from the IP packet's header. However, there might be several different web servers for different web sites listening on that IP and there is no chance to find out which one you intended to visit.

# The Problem with DNS
However, although HTTP is usually encrypted, DNS is usually not. So before your browser performs the actual HTTP request, your operating system will perform a DNS query to resolve, for instance, _"google.com"_ to `216.58.207.46`. Your question – _"What's the IP for google.com?"_ – is contained in the DNS query as plain text, so everyone between your computer and the DNS server will know that you are trying to access Google – or whatever website. And, of course, the provider of your DNS server will know as well, since it has to answer the query.

Usually, your default DNS server is the one provided by your ISP. And since the ISP can directly associate your internet connection with your name and address it will know about any website that you – as a person – visit. Even if you change the default to something else (e.g. [Google's public DNS resolver](https://developers.google.com/speed/public-dns/) 8.8.8.8 or [CloudFlare's](https://1.1.1.1/) `1.1.1.1`), your ISP can still read your DNS queries as they mandatorily pass through its network. Consequently, in order to browse more privately on the web – in addition to using HTTPS - there are two steps you need to consider:

1. Change your DNS provider to one that is more anonymous and does not have personal information about you
2. Encrypt your DNS queries to prevent anyone in the middle (especially your ISP) from reading them

![Example of a non-encrypted DNS request](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/dns1.png)
Example of a non-encrypted DNS request for `kit.edu` to Google's `8.8.8.8` DNS resolver 

Luckily, the [DNS-over-TLS](https://en.wikipedia.org/wiki/DNS_over_TLS) specification already provides a solution and it is already supported by the three largest public DNS providers [CloudFlare](https://1.1.1.1/), [Google](https://developers.google.com/speed/public-dns/) and [Quad9](https://www.quad9.net/). You only have to configure your computer to use it.

# CoreDNS Setup
In this article, I show you how to use DNS-over-TLS with [CoreDNS](https://coredns.io/) as a local DNS recursor on your machine. It is an open-source software and primarily known for being used as a nameserver in Kubernetes networks. Please note that I decided to use CoreDNS, because it is particularly easy to configure and offers a variety of cool [plugins](https://coredns.io/plugins/), like [metrics collection with Prometheus](https://coredns.io/plugins/metrics/) and more. However, Ubuntu's default DNS recursor [systemd-resolved apparently supports DNS-over-TLS](https://www.internetsociety.org/blog/2018/12/dns-privacy-in-linux-systemd/) as well and is probably easier to get started with initially. So if you prefer to go the easy way, just head over to the previously mentioned blog post and follow its instructions.

**Disclaimer:** Please use this guide at your own risk. I do not take any responsibility in case you accidentally crash your DNS setup.

In order to set up CoreDNS, there are a few steps to follow.

1. Download CoreDNS from the [website](https://coredns.io), unpack the binary to `/usr/local/bin` and make it executable (`sudo chmod +x /usr/local/bin/coredns`)
2. Install `resolvconf` as a tool to manually manage `/etc/resolv.conf`: `sudo apt install resolvconf`  
3. Set `dns=default` in `/etc/NetworkManager/NetworkManager.conf`
4. Add `nameserver 127.0.0.1` to `/etc/resolvconf/resolv.conf.d/head`
5. Create `/etc/coredns/Corefile` and paste the configuration shown below. In this example, we are using CloudFlare as a DNS provider. You can use Google or Quad9 as well, just change the IPs.
6. Create a new user for CoreDNS: `sudo useradd -d /var/lib/coredns -m coredns`
7. Set some permissions: `sudo chown coredns:coredns /opt/coredns`
8. Download the SystemD service unit file from [coredns/coredns](https://github.com/coredns/deployment/tree/master/systemd) to `/etc/systemd/system/coredns.service`
9. Disable SystemD's default DNS server: `sudo systemctl stop systemd-resolved && sudo systemctl disable systemd-resolved`
  1. **Please Note:** From that moment on, you will not be able to resolve any web pages anymore, unless you enable DNS again
10. Enable and start CoreDNS: `sudo systemctl enable coredns && sudo systemctl start coredns`
11. You should be able to resolve domain names, again. E.g. try `dig +short kit.edu`. If an IP address is printed, everything works fine.

```
# /etc/coredns/Corefile

.:53 {
    forward . tls://2606:4700:4700::1111 tls://1.1.1.1
    log
    errors
    cache
}
```

![Example of an encrypted DNS request](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/dns2.png)
Example of an encrypted DNS request for `kit.edu` to CloudFlare's `1.1.1.1` DNS resolver

Alternatively, use the following `forward` statement to use the independent [BlahDNS](https://blahdns.com) instead of CloudFlare as provider.

```
forward . tls://2a01:4f8:1c1c:6b4b::1 tls://159.69.198.101 {
    tls_servername dot-de.blahdns.com
}
```

# What happens?
Let us examine what happens (in terms of DNS) when you type _"kit.edu"_ in your browser's address bar and hit enter.

1. Your browser asks your operating system to resolve `kit.edu`
2. Your OS finds out that its primary configured nameserver is `127.0.0.1:53`, i.e. your local CoreDNS, and consults that one
3. CoreDNS checks its cache and in case of a miss consults its configured nameserver at `1.1.1.1`, i.e. CloudFlare
4. CloudFlare, again, checks its cache and in case of a miss goes up the hierarchical chain of nameservers until one of them has an answer
5. Eventually, your browser performs `GET / HTTP/2.0` to `129.13.40.10` with `Host: kit.edu`

# Further Reading
Here are a few additional posts about DNS, which I found very useful.

* [What Is DNS? | How DNS Works](https://www.cloudflare.com/learning/dns/what-is-dns/)
* [DNS-over-https vs. DNS-over-TLS vs DNSCrypt](https://www.reddit.com/r/privacy/comments/89pr15/dnsoverhttps_vs_dns_overtls_vs_dnscrypt/dwsosjr?utm_source=share&utm_medium=web2x)

Please let me know if my guide is missing any required steps. Good luck, have fun and browse safely!