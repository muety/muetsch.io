---
title: LinkedData Trivia Game
date: 2017-02-01 23:09:18
tags:
---

Originally I got inspired by [this recent post](https://news.ycombinator.com/item?id=13677748) on HackerNews, where [alex_g](https://news.ycombinator.com/user?id=alex_g) has built a quiz, which automatically generates questions from Wikipedia articles using natural language processing (NLP). However, I found the results not that satisfying, yet, and decides to build my own dynamic quiz. Instead of NLP processing I decided to use Linked Data as a base for generating questions. More precisely I'm using the [DBPedia](https://dbpedia.org) knowledge base to retreive fact information from, which mostly originates in Wikipedia articles as well. The data is structured as an RDF graph and can be queried using SPARQL. Despite from the official DBPedia SPARQL endpoint this little proof-of-concept-like app uses another webservice, [kit-lod16-knowledge-panel](https://github.com/muety/kit-lod16-knowledge-panel), which I developed in the context of the Linked Open Data seminar at university. It is responsible for ranking RDF properties for specific RDF entities by relevance in order to decide, which one to display to an end-user (or include to a quiz).

[Code on GitHub](https://github.com/muety/linkeddata-trivia)

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/trivia.jpg)

### Limitations
This project is __not a production-ready__ app at all, but rather a __proof-of-concept__ to experiment with. Currently, the __major issue is performance__. Since the app fires a bunch of rather expensive, non-optimized SPARQL queries at the public DBPedia endpoint, the whole process of generating a quiz question takes several seconds on average, sometimes even up to a minute. This could be optimized to a certain extent (e.g. currently there are at least 8 separate HTTP requests from this app plus a few more from the ranking webservice), but all in all querying RDF data is still pretty slow. 

Another limitation is the way "wrong" answer options are generated. Currently, random values within a certain interval around the "correct" answer are generated for dates and numbers. For properties, whose _rdfs:range_ are entities of a class, a random set of other entities from the same class is fetched from DBPedia and shown as alternative answers. However, __string-valued answers, among others, are ignored__ completely, because it's hard to auto-generate an alternative value for a plain string. There's room for enhancement here.

A third way for improvement would be to include not only DBPedia, but also [Yago](https://yago-knowledge.org), Wikidata and other sources. 