---
title: Time Tracking for Developers – WakaTime vs. Hakatime vs. Wakapi
date: 2021-04-10 11:01:15
tags:
---

![Title Image](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/time_tracking_cover.jpg)

# Automated time tracking

As a developer, you might be wondering how much time you are spending coding on a specific project, in a specific programming language, etc. Gathering detailed statistics about your work day might help you gain valuable insights on how to increase your productivity. Or maybe you are just a statistics freak, like me, who likes to track and analyze things. What you will need for that purpose is an automated time tracking tool. Many of these exist, but this article focuses on such that are specifically meant for developers, more specifically, on [WakaTime](https://wakatime.com) and its derivatives in particular.

# WakaTime and friends
WakaTime is one of the most popular and wide-spread automated time tracking softwares for developers. It was – and still is – built by [Alan Hamlett](https://github.com/alanhamlett) and started out [back in 2013](https://news.ycombinator.com/item?id=9994143). Its concept is very straightforward. Developers install a plugin into their code editor or IDE, which sends so called heartbeats to a web service on a regular basis. These heartbeats include all kinds of information on the project and the specific file you are currently working on. The backend-side web service aggregates and processes those heartbeats and generates detailed statistics and graphs from them, which you can then browse in a web dashboard. Many parts of WakaTime are open-source, however, the web service itself, which contains most of the core business logic, is not.

WakaTime comes with around [50 different IDE plugins](https://wakatime.com/plugins) (ranging from IntelliJ over VSCode to Vim and Emacs), which are all open source. Third-party projects like [Hakatime](https://github.com/mujx/hakatime) and [Wakapi](https://wakapi.dev) started to build up on that basis and implement their own backends, which resemble the official WakaTime's API and therefore are (partially) compatible.

In the following, I want to present a brief comparison between these three software tools. Feel free to reach out if you are missing any aspect or if there is a mistake.

**Disclaimer:** I am the author of Wakapi.

# Comparison

## General
|                   | WakaTime          | Hakatime        | Wakapi        |
|-------------------|-------------------|-----------------|---------------|
| Started in        | [2013](https://github.com/wakatime/wakatime/commit/3da94756aa1903c1cca5035803e3f704e818c086)              | [2020](https://github.com/mujx/hakatime/commit/7dae338ece5bb485183c8c3e97e1cd3e36d7baae)            | [2019](https://github.com/muety/wakapi/commit/0bd71b77085da62c573b44bb3a39f420840e7157)          |
| **Open source**       | Partially (BSD-3) | ✅ Yes (Unlicense) | ✅ Yes (GPL-3.0) |
| **GitHub**       | [wakatime/wakatime](https://github.com/wakatime/wakatime) | [mujx/hakatime](https://github.com/mujx/hakatime) | [muety/wakapi](https://github.com/muety/wakapi) |
| **Written in**        | Python            | Haskell         | Go            |
| **Databases**        | –            | Postgres         | SQLite, MySQL, Postgres, CockroachDB            |
| **API**               | ✅ Yes               | ✅ Yes             | ✅ Yes           |
| **API Docs**          | ✅ [Yes](https://wakatime.com/developers)               | ⛔️ No              | ✅ [Yes](https://wakapi.dev/swagger-ui/)           |
| **SaaS**              | ✅ [Yes](https://wakatime.com)               | [Demo only](https://hakatime-demo.mtx-dev.xyz/)       | ✅ [Yes](https://wakapi.dev)           |
| **Self-hosted**       | ⛔️ No                | ✅ Yes             | ✅ Yes           |
| **Docker deployment** | ⛔️ No                | ✅ Yes             | ✅ Yes           |
| **Pricing**           | $0 - $49 / month  | –               | –             |

## Features
|                        | WakaTime | Hakatime | Wakapi |
|------------------------|----------|----------|--------|
| **Teams / Orgs**           | ✅ Yes      | ⛔️ No       | ⛔️ No     |
| **Goals**                  | ✅ Yes      | ⛔️ No       | ⏳ [TBD](https://github.com/muety/wakapi/issues/166)    |
| **Leaderboards**           | ✅ Yes      | ✅ Yes      | ⛔️ No     |
| **Badges**                 | ✅ Yes      | ✅ Yes      | ✅ Yes    |
| **Data import**            | –       | ✅ Yes      | ✅ Yes    |
| **3rd-party integrations** | ✅ Yes      | ⛔️ No       | ⛔️ No     |
| **Prometheus export**      | ⛔️ No       | ⛔️ No       | ✅ Yes    |
| **E-Mail reports**         | ✅ Yes      | ⛔️ No       | ✅ Yes    |
| **Timeline charts**        | ✅ Yes      | ✅ Yes      | ⏳ [TBD](https://github.com/muety/wakapi/issues/101)    |
| **Activity charts**        | ⛔️ No      | ✅ Yes      | ⏳ [TBD](https://github.com/muety/wakapi/issues/12)    |

## Statistics
|                   | WakaTime | Hakatime | Wakapi |
|-------------------|----------|----------|--------|
| **Projects**          | ✅ Yes      | ✅ Yes      | ✅ Yes    |
| **Languages**         | ✅ Yes      | ✅ Yes      | ✅ Yes    |
| **Editors / IDEs**    | ✅ Yes      | ⛔️ No (?)       | ✅ Yes    |
| **Operating Systems** | ✅ Yes      | ⛔️ No (?)       | ✅ Yes    |
| **Machines**          | ✅ Yes      | ⛔️ No (?)       | ✅ Yes    |
| **Files**             | ✅ Yes      | ✅ Yes      | ⏳ [TBD](https://github.com/muety/wakapi/issues/80)    |
| **Branches**          | ✅ Yes      | ✅ Yes      | ⛔️ No     |
| **Commits**           | ✅ Yes      | ✅ Yes      | ⛔️ No     |


# Screenshots
## WakaTime
![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/wakatime_screenshot.png)

## Hakatime
![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/hakatime_screenshot.png)

## Wakapi
![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/wakapi_screenshot.png)

For Wakapi, a major redesign of the user interface [is planned](https://github.com/muety/wakapi/issues/82#issuecomment-774993875).

# Summary

Clearly, WakaTime is the most mature and feature-rich tool, but, of course, comes at a cost.

Hakatime has a nice-looking, clean user interface and beautiful visualizations. On the other hand, it felt a bit rough and sometimes buggy here and there during my tests. But of course, this is a subjective experience.

Wakapi is built on a solid, technical basis and provides lots of configuration options for developers. However, its current UI is quite minimalist and less fancy, compared to the other tools.

All three projects are under active development and with many new features about to come in the future. Wakapi also highly welcomes open source contributions to its code base.

If you are interested in tracking your coding statistics, I would like to encourage you to give all three tools a try. Feel free to share your thoughts!