---
title: Quick thoughts on AI in open source
date: 2026-09-17 16:00:58
tags: [ai, software-engineering]
---

# Intro
The following thoughts are inspired by two recent blog posts ([here](https://openjsf.org/blog/the-openjs-foundation-cna-is-taking-a-coordinated-break) and [here](https://openjsf.org/blog/ai-is-stress-testing-open-source)) by the [OpenJS Foundation](https://openjsf.org/).

Even though AI comes with a lot of benefits for sure, it also poses a significant problem to the open-source ecosystem at its current state. AI-generated bug- and security reports (if not to say AI slop) are becoming an issue of ever increasing significance

# The core problem
Most open-source projects – no matter whether it has just 10 GitHub stars or is widely used across the whole industry _"everywhere from NASA to Netflix"_ – are **maintained by volunteers** – not few of whom [burn out](https://openjsf.org/blog/burnout-is-real-for-open-source-maintainers) eventually.
At the same time, 

> AI has lowered the barrier to generating security reports, but not the cost of handling them. [...] Volunteer availability does not scale with report volume. And when security triage overwhelms maintainers, the entire project slows down.

Ironically, this potentially even makes the projects _"**less secure** by draining the very capacity needed to respond well"_. 

Large projects apparently receive ~10x as many security reports today compared to before the AI era. Also for [Wakapi](https://wakapi.dev), I receive AI-generated bug reports or security incident disclosures on almost a regular basis now. **Not all of them are crap**, of course. One recent report actually revealed a pretty high-severity [security bug](https://github.com/muety/wakapi/security/advisories/GHSA-x48w-3rq3-w2pq) in Wakapi (even though the reporter clearly didn't put any personal effort in finding it – even the email he sent was obviously AI-generated). But they only help **as long as the maintainers can keep up**.

Given that, it's not much of a surprise to me that maintainers of whole open source foundations now decide to **take a break**, during which they deliberately won't respond to tickets. The cURL lead dev proclaimed a ["summer of bliss"](https://daniel.haxx.se/blog/2026/06/15/curl-summer-of-bliss/) – one month during which he "will not accept or otherwise handle any vulnerability reports". The OpenJS foundation does a similar thing with their [coordinated break](https://openjsf.org/blog/the-openjs-foundation-cna-is-taking-a-coordinated-break).

# What to do about it?
It's quite clear. Companies who rely on open-source technology (so basically every tech company) should "invest upstream" – **contribute workforce** to the projects or **donate money** to support the maintainers. Please 🙏
