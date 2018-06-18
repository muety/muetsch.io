---
title: OverGrive not starting on Ubuntu 18.04
date: 2018-06-18 07:37:13
tags:
---
# Problem
First of all: I am really happy that it seems like I finally found a working Google Drive client for Linux, [overGrive](https://www.thefanclub.co.za/overgrive). It seems to be written in Python and, unfortunately is not open source, but rather costs $4.99. But that is fine as long as it actually works.
However, I had some issues when trying to install overGrive for the first time. I am using Ubuntu 18.04, so I followed the [official installation instructions](https://www.thefanclub.co.za/overgrive/installation-instructions-ubuntu), including downloaing the `.deb` package and installing it with _dpkg_. I could see overGrive in Gnome's app launcher afterwards, but when I clicked it, nothing happened. It did not start without any error message.

# Solution
The solution was the following. I figured out that overGrive is by default installed to `/opt/thefanclub/overgrive` and the binary can be run with Python (2.7), like `python /opt/thefanclub/overgrive/overgrive`. This gave me the error message that `No module named oauth2client.client`. After googling I found that I manually had to install these Python modules in addition.

* `sudo pip install google-api-python-client`
* `sudo pip install oauth2client`

If pip complains about further missing dependencies while installing one of the above packages, simply `pip install` them, too.

Good luck! And again, thanks to [thefanclub](https://www.thefanclub.co.za/) for this Google Drive sync client.