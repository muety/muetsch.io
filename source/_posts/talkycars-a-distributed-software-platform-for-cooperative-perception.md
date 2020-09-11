---
title: 'TalkyCars: A Distributed Software Platform for Cooperative Perception'
date: 2020-09-11 09:24:31
tags:
---

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/talkycars9.png)

# Introduction
This is a short, summarizing write-up about the topics of my Master's thesis, published in February 2020 in cooperation with [Prof. Dr. Sax](https://www.itiv.kit.edu/21_3940.php), [M.Sc. Martin Sommer](https://www.itiv.kit.edu/21_6289.php) and [M.Sc. Marco Stang](https://www.itiv.kit.edu/21_5341.php) at the [KIT Institute for Information Processing Technologies](https://itiv.kit.edu).

# Citation (BibTeX)
```bibtex
@mastersthesis{Mutsch2020,
    author = {Mütsch, Ferdinand},
    school = {Karlsruhe Institute of Technology},
    title = {{TalkyCars: A Distributed Software Platform for Cooperative Perception among Connected Autonomous Vehicles based on Cellular-V2X Communication}},
    year = {2020},
    doi = {10.5445/IR/1000118118},
    URL = {http://dx.doi.org/10.5445/IR/1000118118},
}
```

# Motivation
Our work is in the field of autonomous driving, more specifically: cooperative perception. While the topic itself is very diverse, we attempted to approach cooperative perception mainly from a software architecture point of view.

Let us first have a quick outlook. Nowadays, automated driving is still quite rare. However, although forecasts on its future development vary greatly, many researchers predict that level 4 automated vehicles may be around quite soon and level 5 cars may be production-ready already by 2030 [[1]](#refs), [[2]](#refs), [[3]](#refs). However, in the beginning, self-driving cars will find themselves having to operate among highly mixed traffic. That is, traffic with still a high percentage of manully controlled cars. Therefore, a tremendously high level of safety is required.

# Cooperative Perception

One approach to increase reliability and safety of automated vehicles is the concept of cooperative perception. In essence, the idea is to have the cars not only rely on their own sensory, but communicate with surrounding vehicles to mutually exchange information about their environment. In that sense, cooperative perception is a use case of vehicle-to-vehicle – or more broadly – vehicle-to-everything communication. It enables cars to virtually extend their field of view and, for instance, be able to look around corners.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/nloss_2.png)
![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/nloss_3.png)
(Source: [[4]](#refs))

Cooperative perception is a topic of research for years already. Most present approaches rely on so called vehicular ad-hoc networks among participants using dedicated short-range communication. That is, cars within range of each other form pair-wise temporary connections using a technology similar to WiFi. Not uncommonly, they exchange low-level sensor data, for instance LiDAR point cloud, camera images, etc.

There is research which shows that these approaches face some limitations, mainly in terms of latency and data throughput. Consequently, our work assumes a different technological basis. We require that information is exchanged not in form of ad-hoc mesh networks, but through on or more central nodes using cellular communication. Moreover, we do not want to share raw senor data, which can become quite large, but higher-level information that corresponds to a common, shared environment model.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/talkycars2.png)
(Source: [[4]](#refs))

# Approach 
Essentially, there are two major areas to cover in order to develop an end-to-end cooperative perception system prototype. First, we need to define a common language or **model** that all traffic participants use to describe themselves and their environment. Second, a software- and communications **architecture** needs to be designed, as we need a system that enables efficient, scalable and low-latency communications among network participants.

## Environment Modeling
Let us focus on the modeling aspect first. There already exist elaborate approaches for modeling and state representation for cooperative perception. Most famously, there are cooperative awareness- and cooperative perception messages [[5]](#refs), [[6]](#refs). In addition, Kohlhaas et al. [[7]](#refs) suggested to combine low-level, primitive attributes – like position and velocity – with higher-level, semantic knowledge. More specifically, they propose a modeling approach that also incorporates relationships among different entities and traffic participants within a traffic scene. In 2018, another research group first proposed the use of so called probabilistic entity relationship models for traffic scene representation [[8]](#refs). 

For our environment model, we combine these aapproches with the concept of geo tiling using so called QuadKeys ([[10]](#refs)). In essence, geo tiling means to recursively divide the world map into four squares up to almost arbitrarily high precision. Each square is then uniquely identifiable through a key. Using these QuadKeys, we have a simple, commonly-understood and unique way of referencing geographical locations. Especially, it prevents from having to translate between different local- and global coordinate systems.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/quadkeys.jpg)
(Source: [[9]](#refs))

Moreover, we can utilize geo tiles as a basis for our environment model. We propose a model that represents an occupancy grid at its core, whereas each cell corresponds to a tile of a certain, fixed precision level. For instance, with a QuadKey precision level of 25, we would require our intelligent vehicles to represent and share their perceived environment state as an occupancy grid with cells of approx. 1.1 by 1.1 meters in size. 

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/talkycars3.png)

Naturally, a cell's occupancy state alone, that is "occupied" or "not occupied", is not sufficient to comprehensively model a traffic scene. Therefore, we allow each cell to contain additional state information following a comprehensive meta model. For instance, the type of traffic participant, that currently occupies a cell, alongside all of its respective static and dynamic properties might be included as well.

Moreover, there is an other interesting aspect to our proposed modeling approach. Because all facts of a vehicle's environment are derived from imperfect sensory, they're inevitably accompanied by uncertainty. Moreover, the fact that the description of a traffic scene is only valid for a very short temporal horizon even adds to this uncertainty. This leads to the requirement to use a modeling approach capable of coping with such uncertainty. As a consequence, we decided to pick up on the concept of probabilistic entity-relationship model and represent every fact as a quadruple of subject, predicate, object and confidence. The confidence component corresponds to the likelihood of this fact being true.

```
Graph consisting of 4-tuples:
------
(subject, predicate, object, confidence)

Example:
------
(obstacle_5, isOfType, pedestrian, 0.921)
(obstacle_5, hasPosition, 310112030021333, 0.448)
(obstacle_5, isStoppedAt, traffic_light_189, 0.995)
```

## System Architecture
Let us now focus on the second major aspect: the architecture of a software system that enables for cooperative perception.

Naturally, one essential requirement is good performance. That is, information from different vehicles shall be transmitted and aggregated as fast as possible. As mentioned earlier, many approaches relying on decentralized DSRC communication are potentially limited in latency and throughput. This is why we want to take the approach to rely on cellular communication, preferably using 5G networks. Also, to reduce communication complexity, our approach relies on centralized compute nodes that receive, transform, fuse and re-distribute information from many network participants. Of course, this introduces new challenges. First and foremost there is the requirement of high scalability, as these compute nodes have to handle large amount of data.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/talkycars4.png)

To address this challenge, we once again utilize geo tiling with QuadKeys. In our approach, the environment is split into QuadTiles of a certain size, for instance 5 by 5 km, and a data fusion node is not deployed globally, but once per every tile. Vehicles within such a tile exchange their data through the tile's responsible node. This way, the node only has to cope with a certain, limited amount of senders and receivers.

In summary, the proposed system consists of three core components. On the client-side, that is, the vehicle side, an application is responsible for generating, sending and receiving instances of the previously mentioned environment model. Second, a message broker is deployed once per tile to consolidate incoming data messages. Third, the previously mentioned fusion node is responsible for aggregating these information packets to a single, globally valid model instance and sending it back to the cars.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/talkycars5.png)

# Evaluation
For evaluation purposes, we implemented all parts of our system and integrated it with the CARLA simulation environment. We conducted two different experiments to evaluate the proposed system with respect to performance and quality.

## Software Performance
In the first part of the evaluation, we attempted to answer the question of how many concurrent vehicles the central data broker or fusion node is able to handle at a time. In our experiment setup, we deployed one instance of the fusion node as well as a distributed data generator that simulates an increasing amount of vehicles sending their environment models. We required that observations must be fused at a fixed rate, for instance, 10 times per second. Then we measured the actual rate at which the fusion node is able to process incoming observations as the number of sender vehicles increased. Eventually, we found that the possible fusion rate heavily depends on the size of the underlying occupancy grid and that our very little optimized implementation is able to maintain a fusion rate of 10 Hz with up to 220 concurrent vehicles at a grid size of approx. 50 meters and 100 concurrent vehicles at a grid size of approx. 100 meters. 

![](https://apps.muetsch.io/images/o:auto/rs,s:400?image=https://muetsch.io/images/talkycars6.png)

## End-to-End Perception Quality
The second part of the evaluation aimed to assess whether a vehicle's overall perception quality can be improved through the use of our system in general.

Therefore, we utilized the CARLA simulation environment and repeatedly generated different urban traffic scenes with a fixed amount of connected, intelligent vehicles, each of which runs our proposed software system. Every vehicle was tasked to traverse the environment from a random start point to a random destination. While driving, every vehicle recorded its own local perception, derived from its sensors, including all perceived obstacles. Later, these perceived environment states are compared to the true state of the environment provided by the simulator. Accordingly, an error measure can be derived. To asses whether or not our proposed system is beneficial to a self-driving car's perception quality, every instance of the experiment is run twice: once with and once without cooperative perception. Eventually the respective error measures can be compared.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/talkycars7.png)

Doing so, we found that the average perception quality, that is, the accuracy of detecting obstacles in the simulation, could be improved significantly in our test scenarios.

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/talkycars8.png)
(Image: Recall ("hit rate") for occupied cells with / without CP)

# Conclusion
With our work, we contributed a proof-of-concept for a novel approach to cooperative perception, utilizing centralized, cellular communication and involving a comprehensive meta model for traffic scene representation. Both our reference implementation as well as the concept itself still demands for optimizations in order to be advanced to a real-world applicable system. However, it can serve as a basis for future research. 

The entire project is [open-source](https://github.com/muety/talkycars-thesis).

# References
<a name="refs"></a>

1. McKinsey Center for Future Mobility. (2019). Autonomous Driving | MCFM | McKinsey. Retrieved November 25, 2019, from [Link](https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/overview/autonomous-driving)
2. Thomson, C. (2017). Elon Musk has a stunning prediction for what cars will be like 10 years from now. Retrieved from [Link](https://www.businessinsider.com/elon-musk-predicts-most-cars-will-be-driverless-in-10-years-2017-2?r=DE&IR=T)
3. BMW Group. (2019). Contract signed: BMW Group and Daimler AG launch long-term development cooperation for automated driving. Retrieved from [Link](https://www.press.bmwgroup.com/global/article/detail/T0298266EN/)contract-signed:-bmw-group-and-daimler-ag-launch-long-term-development-cooperation-for-automated-driving
4. [Link](https://www.qualcomm.com/media/documents/files/accelerating-c-v2x-commercialization.pdf)
5. European Telecommunications Standards Institute (ETSI), “ETSI TR 103 562,” Sophia Antipolis, 2019.
6. A. Rauch, F. Klanner, and K. Dietmayer, “Analysis of V2X communication parameters for the development of a fusion architecture for cooperative perception systems,” in 2011 IEEE Intelligent Vehicles Symposium (IV), 2011, pp. 685–690.
7. R. Kohlhaas, T. Bittner, T. Schamm, and J. M. Zollner, “Semantic state space for high-level maneuver planning in structured traffic scenes,” in 17th International IEEE Conference on Intelligent Transportation Systems (ITSC), 2014, pp. 1060–1065.
8. D. Petrich, D. Azarfar, F. Kuhnt, and J. M. Zollner, “The Fingerprint of a Traffic Situation: A Semantic Relationship Tensor for Situation Description and Awareness,” in 2018 21st International Conference on Intelligent Transportation Systems (ITSC), 2018, pp. 429–435.
9. [Link](https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system)
10. Schwartz, J. (2018). Bing Maps Tile System - Bing Maps | Microsoft Docs. Retrieved November 26, 2019, from [Link](https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system)