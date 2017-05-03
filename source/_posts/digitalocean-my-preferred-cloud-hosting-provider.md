---
title: Digitalocean – My preferred Cloud Hosting Provider
date: 2016-04-06 22:55:18
tags:
---

![](/images/do.png)
[DigitalOcean.com](https://digitalocean.com) is a service that offers you on-demand virtual server instances that you can use to host any server application, be it a simple webpage, a Node.js written backend, any Docker container or anything else.

It is especially useful if you have developed a web application and want to bring it to the internet without owning a root server. In this case you can go to DigitalOcean, choose any boilerplate (or Droplet, as they call it) for your new virtual, cloud-hosted machine, additionally choose a the datacenter region which is closest to you or your customers, add your SSH keys for quick access and hit the create button. Within less than a minute your machine is up and running with a dedicated IPv4 assigned where you can ssh in.

As a template / boilerplate you can either choose from the common, plain Linux distributions (even CoreOS) in almost any version or take one of the various pre-configured environments like a machine already running Docker, Node.js, ownCloud, Joomla or plenty other runtimes and applications.

For scalability you can choose between different sizes, which basically means different memory capacity, cpu cores, ssd capacity and amount of traffic.

A feature which I only know from DigitalOcean by now is the ability to create a cluster of multiple machines (Droplets) with private networking, meaning they can communicate with every other node in the cluster but are kind of isolated from the internet. I haven’t tried this feature too much but it is similar to what you might know from linking multiple Docker containers together.

What I also like about the service is the ultra simple-to-use, minimalistic and intuitive web-interface that abstracts away this entire technical complexity running in the background when users do a single click on a button until a pre-installed machine comes up.

DigitalOcean is my personal favorite service of this type, but I also want to mention some alternatives which are [Microsoft Azure](https://azure.microsoft.com/en-us/), [Google Compute Engine](https://cloud.google.com/compute/), [Amazon EC2](https://aws.amazon.com/de/ec2), [Linode](https://www.linode.com/) or in a wider sense also [JiffyBox.de](http://jiffybox.de).

If you want to give DigitalOcean a try (and support me), follow [this referral link](https://m.do.co/c/4abee7f659ad) where you get $10 in credits, which is enough for running the smallest container for two months. I will get $25 in credits in case you in turn spend $25 for credits. Of course I would be very pleased if you did so.

![](assets/img/simple-smile.png)