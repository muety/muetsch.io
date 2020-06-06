---
title: 'Modern, reactive web APIs with GraphQL, Go and Server-Sent Events – Part 1'
date: 2020-06-06 11:59:23
tags:
---

# Introduction
In the course of this two-part article, the interested reader is briefly introduced to the basic of GraphQL and how it compares to traditional approaches. In the second part, an example single-page web application (SPA) is built to demonstrate the use of GraphQL in combination with further modern web technologies. The [final project](https://github.com/muety/go-graphql-sse-example) provides a clean, opinionated code- and project structure for both backend and frontend and constitutes a good starting point for new apps based on the presented tech stack.

\> **Code**: [muety/go-graphql-sse-example](https://github.com/muety/go-graphql-sse-example)

# What is GraphQL?
[GraphQL](https://engineering.fb.com/core-data/graphql-a-data-query-language/) is a relatively new (proposed in 2015 by Facebook engineers) approach to designing APIs for (web) backend applications and can be considered an alternative to [REST](https://developer.mozilla.org/en-US/docs/Glossary/REST) or remote-procedure-call (RPC) mechanisms like [JSON-RPC](https://www.jsonrpc.org/). In other words, it's *"an open-source data query and manipulation language for APIs"* [[1]](https://en.wikipedia.org/wiki/GraphQL). The specification is open-source and actively evolving on [GitHub](https://github.com/graphql/graphql-spec). While REST APIs are currently the de-facto standard on the web (although not necessarily all of them being fully [mature](https://www.martinfowler.com/articles/richardsonMaturityModel.html)) – GraphQL starts to [gain traction](https://trends.google.com/trends/explore?date=2018-05-06%202020-06-06&gprop=youtube&q=graphql).

## Comparison with REST and RPC

In contrast to REST, which is primarily structured around resources or entities and RPC-based APIs, which focus on actions or methods, GraphQL is all about the underlying data itself. The consumer of an API – usually the frontend / client-side part of a SPA – only has to know the schema and structure of the data provided by the API to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) it. Compared to REST APIs, where the consumer heavily depends on the fixed data structure delivered by the backend API, this is especially beneficial as it introduced a lot more flexibility and decoupling and can save the developer some time making the client-side application [tolerant](https://martinfowler.com/bliki/TolerantReader.html). Also, you will probably not need [backends for frontends](https://docs.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends) anymore.

Essentially, with GraphQL, **the consumer asks exactly for what it needs and how it needs it**, i.e. your client application tells the backend exactly what to return and in which format. **Consuming a GraphQL API is like querying a database, but with more guidance and control.**

## Example
Let's look at an example to get a better idea of how GraphQL works, especially in comparison to the REST principles. 

Imagine you have an e-commerce application with products and orders. Every order consists, among others, of a set of products. As the operator of the web shop, you might want to get a list of all orders. With a more or less RESTful API (we neglect the hypermedia controls in the example though), your request-response pair could look like this:

```
Request
-------
GET /api/orders

Response Body
-------------
[
    {
        "id": 125,
        "customerId": 8977,
        "createdAt": "2020-06-06T13:40:49.038Z",
        "productIds": [ 49863176 ]
    }
]
```

So far so good, but potentially you will also want to view the actual products right away. What you got are only ids, for each of which you would have to issue another API call to retrieve it. Alternatively, the API could also return nested objects, like so:

```
[
    {
        "id": 125,
        "customerId": 8977,
        "createdAt": "2020-06-06T13:40:49.038Z",
        "products": [
            {
                "id": 49863176,
                "name": "Slim T-Shirt navy-blue",
                "price": 17.90,
                "options": [
                    {
                        "id": "size",
                        "name": "Size",
                        "description": "T-Shirt size",
                        "values": [
                            {
                                "id": "s",
                                "name": "Size S",
                            },
                            {
                                "id": "m",
                                "name": "Size M",
                            },
                            {
                                "id": "l",
                                "name": "Size L",
                            }
                        ]
                    }
                ]
            },
        ]
    }
]
```

However, that is — to my understanding – not truly RESTful anymore. Also, while the above example is still quite straightforward, things get ugly as nested objects include other nested objects, that include other nested objects, that... Quickly you get JSON responses of several tens or hundreds of kilobytes, although you're potentially only interested in two or three attributes. Moreover, on some pages of your shop you may be interested in all possible options (e.g. "size") of a product, but not on others. Should your API define different [view models](https://www.infoq.com/articles/View-Model-Definition/) now and expose different endpoints? Or a single endpoints with query flags like `?expanded=true`? Soon you might be catching yourself **tailoring your API specifically to the needs of your client** while neglecting REST conventions and a straightforward design. 

With GraphQL, things are different. Your API is a bit **dumber and less opinionated** now and does not deliver data in a fixed structure, according to a specified [GQL query](https://graphql.org/learn/queries/), which looks a lot like JSON. The above example might look like this, now:

```
Request
-------
POST /api/graphql/query

{
    "query": "\{
        orders {
            id
            customerId
            products {
                name
                price
                options {
                    name
                }
            }
        }
    \}"
}

Response Body
-------------
{
    "data": {
        "orders": [
            {
                "id": 125,
                "customerId": 8977,
                "products": [
                    {
                        "name": "Slim T-Shirt navy-blue",
                        "price": 17.90,
                        "options": [
                            {
                                "name": "Size",
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

This way, you get only the data you want. All your API has to know is how to fetch every piece of data. All your client has to know is how the data schema itself looks like.

## Try it out
![](images/graphql_github.png)

GitHub's official API offers GraphQL query endpoints. You can try it out using their [GraphQL explorer](https://developer.github.com/v4/explorer/).

# GraphQL Basic
Since this article does not aim to be another introduction to GraphQL, you can read most of the basics about fields, data types, etc. in the [official docs](https://graphql.org/learn/queries/). However, it is worth mentioning that GraphQL supports three types of queries:

* **`Query`**: "Standard" type of queries, used for fetching data (see above). Similar to what you would do with a `GET` in REST.
* **`Mutation`**: Query type used to modify data. Similar to what you would do with a `PUT`, `POST`, `PATCH` or `DELETE` in REST.
* **`Subscription`**: Query type to communicate your intent to subscribe to live data updates. 

## Subscriptions

While a basic GraphQL application will at least use the former two types, the latter is especially interesting in the context of this article. Using subscriptions, you can have your web frontend be notified when new data arrives at the server or existing data changes. For instance, the operator of the above web shop could have a live-updating dashboard, that shows new orders just as they are placed. 

For subscriptions, the GraphQL standard does not define a lot more than their plain existence and purpose. Especially, it is not defined how and which technology to implement them. On the web, any [publish/subscribe](https://docs.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber)-like mechanism that provides bi-directional or uni-directional server-to-client communication is appropriate. For the sake of simplicity, [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) are used in this article.

# What's next?
This part gave a brief introduction to GraphQL. The next part is about actual code. We're going to build an example web app with live-updates using GraphQL, Go, MongoDB and VueJs. Stay tuned!