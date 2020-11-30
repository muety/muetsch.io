---
title: Watching stock prices with Node-RED and Webhook2Telegram
date: 2020-11-30 21:08:47
tags:
---

# Motivation
I hold a few stocks and I want to stay up-to-date about their quotations. However, I found it a bit tedious to actively log in to my portfolio every day to see what has changed. So I decided that I needed a notification system that **automatically informs me about the relative price changes** for all of my stocks once a day. Since I get all kinds of notifications – including security alerts from my server, updates in my GitHub feed, and more – via [Telegram](https://telegram.org), the choice to use that messenger for stock price notifications as well was quite obvious. Another obvious decision what have been to write a small Python script, that gets executed once a day via CRON. However, this time, **I didn't want to write any code**, but instead try the flow-based visual programming tool Node-RED.

[Node-RED](https://nodered.org/) is a JavaScript-based platform to compose logical workflows through combining small, elementary building blocks together. Such building block, called nodes, include functionality to ingest data (e.g. via HTTP calls, MQTT subscriptions or reading a file), process it (e.g. string replacements, logical condition checks, aggregations, etc.) and output it in some way again (again, via HTTP, MQTT, files, etc.). Without writing any code, but only through configuring these elementary operations, whole programs can be built. While Node-RED is primarily used in IoT contexts, it basically serves any purpose. An even more comprehensive and "mature" alternative is, to some extent, [Apache NiFi](http://nifi.apache.org/). However, while Node-RED is perfect for tinkering and small projects, NiFi focuses on scalability and Big-Data-like workloads.

# Flow
The resulting flow, that fulfills the above mentioned purpose looks like this.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/nodered-flow.png)
([Click to view large](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/nodered-flow.png))

The flow's entry node is an `inject` node, that holds a JSON array of all my stocks' symbols (e.g. `QCOM`) and is automatically executed once every afternoon. The message is then split into multiple, individual messages, namely, one for every stock symbol. A `http request` node then calls the [Alphavantage API](https://www.alphavantage.co/) once for every message to fetch the intra-day price changes. Subsequently, the response is parsed, post-processed and formatted as Markdown. Eventually all individual messages are combined into one again before my [Webhook2Telegram](https://github.com/muety/webhook2telegram) bot is requested to send me the message as a last step.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/nodered-flow2.png)