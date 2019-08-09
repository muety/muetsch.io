---
title: Basic benchmarks of 5 different MQTT brokers
date: 2019-07-17 22:16:53
tags:
---

In the context of my Master's thesis I conducted a very basic performance comparison of several different MQTT brokers and quickly wanted to share my insights. Please note that these benchmarks are quite superficial only. I did not aim to perform an in-depth evaluation, but rather get a basic idea of their performance in general. 

## Setup
* To perform load tests in a _publish_ scenario, I used [takanorig/mqtt-bench](https://github.com/takanorig/mqtt-bench), an MQTT benchmarking tool written in Go.
* All tests were run with the options `-count 10000`, `-clients 25` and `-size 4096`, which means to simulate 25 concurrent MQTT clients, each sending 10,000 messages of 4 KBytes size each.
* Both load testing tool as well as the respective broker were run locally on a 6-core, 12-thread, 3.6 Ghz machine with Ubuntu 18.04.
* Unless otherwise stated, the brokers were started with default configuration.

## Brokers
The following brokers were tested.

| Broker        | Written In | Version | Runtime         | Additional Info                                                                                                                                                                             |
|---------------|------------|---------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| hbmqtt        | Python     | 0.8     | CPython 3.6     | –                                                                                                                                                                                           |
| hbmqtt (PyPy) | Python     | 0.8     | PyPy 3.6 v7.1.1 | –                                                                                                                                                                                           |
| HiveMQ CE     | Java       | 2019.1  | Oracle JDK 12   | –                                                                                                                                                                                           |
| Mosca         | JavaScript | 2.8.1   | Node 4.8.0      | –                                                                                                                                                                                           |
| Mosquitto     | C          | 1.6.3   | –               | –                                                                                                                                                                                           |
| RabbitMQ      | Erlang     | 3.7.4   | –               | enabled_plugins=[rabbitmq_management, rabbitmq_management_agent, rabbitmq_management_visualiser, rabbitmq_shovel_management, rabbitmq_stomp, rabbitmq_mqtt,rabbitmq_web_stomp, rabbitmq_web_mqtt] |

## Results
These are the results that I obtained. Higher is better.

![MQTT benchmark results](images/mqtt_bench_2.png)