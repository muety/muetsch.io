---
title: Halite - A rule-based AI bot
date: 2018-01-03 08:04:08
tags:
---

After having spent a considerable amount of time with it last weekend, I wanted to make a short comment on [Halite.io](https://halite.io). Halite is a programming- and AI competition where people can write programs or train algorithms to control a bot that plays in a virtual 2D game environment. There is a leaderboard to track how your bot competes with other players' bots and you can watch a replay of every game your bot has played, which helps _debugging_ your bot as well as figuring out other people's strategies. Originally, I got aware of this challenge through a video by [one of my favorite](https://www.youtube.com/channel/UCfzlCWGWYyIQ0aLC5w48gBQ) YouTube channels and became slightly addicted from that moment on. 

## The Game
![](images/halite_game.png)

While the complete rule set of Halite can be viewed in [their documentation](https://halite.io/learn-programming-challenge/), I only want to explain very basics here. In Halite you play in a space scenario comprising _ships_ and _planets_, while you (= your bot) controls your ships. A ship can do three actions: _move_, _dock_ to or _undock_ from a planet. The more ships you have docked at a planet, the faster you are _mining_ the planet, which means to produce new ships. When two ships get close enough, they can fight and only the winner's ship survives. The game is turn-based, so each of the up to four players' programs are queried (by the game environment) for a list of moves for each of their ships in every turn. Input is the current game state (player- & planet positions, ships' health, ships' current status, ...) and output is a move for each ship. The final goal is to either completely dominate (= destroy every other players' ships) or own the strongest ship fleet and the most planets after 300 turns. 

At the time of writing this article, the leaderboard comprises __~ 4700 players__ from __98 countries__. Most of them are either university students or professionals, who have, in total, played __10.9 million__ games. More interesting statistics can be found at the [stats](http://stats.halite.io:3000/public/dashboard/545ebc3c-4cdb-4940-acf1-e4d1332defac) page. 

## My bot
First of all, what I found especially cool is the fact that players are completely free in their choice of how to realize their bot (hard-coding, machine learning, ...) and what programming language to use. Halite offers community-created starter templates for C++, C#, Dart, Elixir, Go, Haskell, JavaScript, Julia, Kotlin, PHP, Ruby, Rust, Scala, Swift and more. You can choose whatever language you like - which was __Java__ for me - and eventually submit a ZIP file with your code or binary, as well as a script for executing it, to their website. The interface between your program and the game environment is _stdin_ / _stdout_. 

![](images/halite_langs.png)

I decided to build my bot based on rather simple rules first, which I figured out by watching some other players' replays. Probably applying machine learning to solve Halite would be even more challenging, but at the time I got aware of this competition, it was about to last only three more weeks (until January, 22nd), so I picked up on a rather simple approach.

## Strategies
I developed three different strategies for playing Halite, while my bot could dynamically switch between them during the game. The first one is called the __BalancedStrategy__. It's a fair mixture of conquering new planets, raising ship production and destroying enemy ships. In this strategy, a ship's most preferable goal is to take empty planets. However, if the next empty planet is unavailable ot too far away, it may also dock at a planet my bot already owns in order to increase production. However, no more than three of my own ships will ever dock at the same planet. If both the next empty planet as well as the next own planet are unavailable or too far away, the ship starts chasing the nearest enemy ship. 

In addition to this compromise-like strategy, I found that more extreme ones can be successful, too. For instance, in a 1 vs. 1 match, my opponents usually won because they almost instantly destroyed all of my ships in the very beginning. So I decided to further introduce the __AggressiveStrategy__, which is only applied in matched of two players. Following this strategy, all of my three initial ships immediately start chasing the enemy's three ships. If they're successful, the game is usually over after only a few turns. 

Finally I built the __MiningStrategy__. Goal is to maxmimize mining rate right in the beginning. My three ships are immediately docking at the nearest and largest (in terms of how many ships can dock at it) free planet and dock at it. New ships will dock at the same planet until it's full. Doing so, I can quickly produce new ships which then, after the first planet is full, switch over to applying the __BalancedStrategy__. 

## Results
Using the bot described above, the best rank I achieved in the leaderboard was __250 of ~ 4500__ (top 6 %) and I'm still ambitious to get even better 😃. My bot is playing as [n1try](https://halite.io/user/?user_id=7481).

\>> [Source code on GitHub](https://github.com/muety/halite-bot-java). 