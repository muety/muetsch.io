---
title: Http performance Java (Jersey) vs. Go vs. NodeJS
date: 2016-11-19 23:06:49
tags:
---

I developed a very basic benchmark suite to compare different HTTP server's performance. It is inspired by [arcadius/java-rest-api-web-container-benchmark](https://github.com/arcadius/java-rest-api-web-container-benchmark), but uses [h2load](https://github.com/nghttp2/nghttp2#benchmarking-tool) instead of [ab](http://httpd.apache.org/docs/2.4/programs/ab.html).

I implemented four very basic REST APIs with exactly one route each, which exposes a small, static todo list as JSON.

## Server Implementations
* __Java:__ [Jersey](http://jersey.java.net/) with embedded [Grizzly](https://grizzly.java.net/)
* __Go:__ Using plain `net/http` package
* __NodeJS:__ Using plain `http` package
* __NodeJS:__ Using de-facto standard [Express 4](http://expressjs.com/) framework

## Setup
My machine, where the benchmark suite was executed on, has the following specifications.

```
===CPU:
model name	: Intel(R) Core(TM) i5-3317U CPU @ 1.70GHz
cpu cores	: 2
model name	: Intel(R) Core(TM) i5-3317U CPU @ 1.70GHz
cpu cores	: 2
model name	: Intel(R) Core(TM) i5-3317U CPU @ 1.70GHz
cpu cores	: 2
model name	: Intel(R) Core(TM) i5-3317U CPU @ 1.70GHz
cpu cores	: 2
 
===RAM: 
             total       used       free     shared    buffers     cached
Mem:          7.7G       6.3G       1.4G       412M       527M       2.4G
-/+ buffers/cache:       3.3G       4.3G
Swap:         5.6G         0B       5.6G

===Java version: 
java version "1.8.0_101"
Java(TM) SE Runtime Environment (build 1.8.0_101-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.101-b13, mixed mode)
 
===OS: 
Linux ferdinand-notebook 3.16.0-4-amd64 #1 SMP Debian 3.16.36-1+deb8u2 (2016-10-19) x86_64 GNU/Linux

===Node: 
v6.5.0

=== Go:
go version go1.7.3 linux/amd64
```

## Test parameters
Basically there are three parameters to be varied for the benchmark.
* The __number of total reqests__ to be performed against the API. I chose to set this to __100,000__
* The __number of concurrent__ client to make those requests. I chose to have __32__ concurrent clients, each of them making 3,125 requests.
* The __number of threads__ to be used by _h2load_. I set this parameter to four, corresponding to the number of logical CPU cores of my machine.

## Results
Running my [benchmark script](https://github.com/n1try/http-server-benchmarks/blob/master/run-load.sh) delivered the following results.

![](images/benchmarks.svg)

## Discussion
First of all, please notice that this is definitely not a 100 % correct, scientifical evaluation. Rather it should give basic insights on the order of magnitute of the performance differences between different language's HTTP servers.
As we can clearly see, Go is the fastest candidate among my test subjects. However, my implementation only utilized the plain, built-in http package without any custom ServeMux or any router or middleware on top of it. In a real-world application, one would most likely not operate on such a low level, but use frameworks like [Iris](http://iris-go.com/) on top, which add additional overhead.

Second place is Java using Grizzly as an embedded server inside a Jersey application. The reason for me picking Grizzly was that it pointed out to be the fastest among the common servers in [this benchmark](http://menelic.com/2016/01/06/java-rest-api-benchmark-tomcat-vs-jetty-vs-grizzly-vs-undertow/).

Both of my Node implementations perform worst in this benchmark, whereas Express is even only as half as good as the plain http package. Evidently, it introduces quite an amount of overhead. However, one would most likely not implement an actual REST API without a higher-level framework like Express. Consequently, the Express benchmark is probably more representative. 

Conclusing I can say that I was pretty surprised about how large the differences between various servers are. Go is almost six times as fast as Node with Express, even though [Express still has a very great performance](https://raygun.com/blog/2016/06/node-performance/).

The full benchmark results as well as the suite's source code can be found at my [GitHub project](https://github.com/n1try/http-server-benchmarks).

## EDIT
At January 1st 2017 I did some minor adjustments to my benchmark suite. A thoughtful reader has drawn my attention to the fact that my comparison was a little unfair in the way that Go's net/http as well as Grizzly use as many threads as the host system provides CPU core by default, while Node doesn't. Using Node's `cluster` module I made both Node-based webservers use four listener threads, too and actually the results have improved by around 45 %. Furthermore I did an adjustment to the Jersey + Grizzly server by changing the `IOStrategy` from the default `WorkerThreadIOStrategy` to `SameThreadIOStrategy`, which brought around 10 % in this specific case, where we don't have any blocking computations but only spit out static JSON. If you're interested in leaarning more about different io strategies, refer to [this official documentation page](https://grizzly.java.net/iostrategies.html). Here is my updated benchmark chart.

![](images/benchmarks2.svg)