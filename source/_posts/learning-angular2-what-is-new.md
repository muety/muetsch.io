---
title: 'Learning Angular2: What is new?'
date: 2016-02-17 22:51:59
tags:
---

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/angular2_logo.png)

A few days ago i started teaching myself [Angular 2](http://angular.io), which is the successor of the popular frontend web-framework [AngularJS 1.x](https://angularjs.org/). It is still in development and only released as a beta and the developers at Google recommend to not use it in production yet. But I’m sure it will come some time in the near future so why not take a step ahead and already learn it now? As Angular 1 has become very successful and wide-spread for web-applications’ client side I have no doubts that Angular 2 will establish itself pretty quick too.

For those of you who are familiar with Angular 1 and have developed with it yet: according to what I’ve seen so far you will definitely need to take some time for learning Angular 2 – it is considerably different from the first version and got few major changes, at least in my eyes. Those changes include:

*   **Different syntax for directives** in HTML: They have introduced parantheses (), brackets [], stars *, hashtags # and combinations of them to be used in your markup. E.g. parantheses () are used as attributes in HTML elements to bind to their events.
*   There are no controllers anymore. Instead everything is based on (Web-)**Components** (as you may know them from [Google Polymer](https://www.polymer-project.org/1.0/) – if you don’t check this out as well, it is pretty cool), which basically consist of the component’s logic and a view and define a new custom HTML element each. Almost everything in Angular 2 is a component, which enables the code to be even more structurable, more modular and more reusable. But it is a completely new way of thinking in comparison to Angular 1’s controllers.
*   It is based on **ES6 and [TypeScript](http://www.typescriptlang.org/)**. ES6 is the latest JavaScript standard (or version so to say) and TypeScript is even a superset of that, which basically introduces types and modifiers for variables and functions (as you may know from strongly-typed languages like Java). This brings some completely [new features](https://github.com/lukehoban/es6features) and syntax you need to get familiar with. For instance you can define classes with attributes and methods like this now:
```javascript
    class Greeter {
        greeting: string;
        constructor(message: string) {
            this.greeting = message;
        }
        greet() {
            return "Hello, " + this.greeting;
        }
    }

    var greeter = new Greeter("world");</pre>
```

Also there are interfaces, import statements, a shorthand way for anonymous functions called “arrow functions” and many more. Before learning Angular 2 I really recommend to first learn JavaScript ES6 for which [these two videos](https://www.youtube.com/playlist?list=PLoYCgNOIyGACDQLaThEEKBAlgs4OIUGif) are really great.

*   **Dependency injection** has also been reworked to be better understandable, easier to use and more modular now. You will no use @Inectable decorators for injectable services and other modules and provide in the modules by referencing to them in a providers property in components’ @Component decorator.
*   Two-way data-binding is still available but the focus is now on **one-way data-binding** (if I got it right the main reason are performance considerations). One-way data-binding means that data isn’t continuously updated between template and component but only based on events triggered.

Those where just some of the major changes I got so far. If you want to learn Angular 2 I recommend you the following resources:

 * [Angular’s offical Getting Started](https://angular.io/docs/ts/latest/quickstart.html)
 * [Angular 2 Fundamentals](https://www.udemy.com/angular-2-fundamentals/) (a free video course on [Udemy](http://udemy.com) for the very basic concepts)
 * This video tutorial on YouTube which I found quite good (and I really had to laugh at 30:20 minutes). You can skip the first few minutes.  

[![](http://img.youtube.com/vi/KL4Yi3WtymA/0.jpg)](http://www.youtube.com/watch?v=KL4Yi3WtymA)

Being able to develop the brand new, fancy Angular 2 with the brand new JavaScript ES6 (which is so new that most of today’s browsers won’t even understand it and as a result it needs to get transpiled to ES5 at present) will definitely give you benefits in web development and also in finding a job in that sector – which is probably the fastest growing and most hyped one at the moment.