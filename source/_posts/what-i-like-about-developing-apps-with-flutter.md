---
title: What I like about developing apps with Flutter
date: 2019-03-11 08:45:20
tags:
---

After hearing about [Flutter](https://flutter.dev) by [Matt Carroll](https://twitter.com/@flttry) and [Abraham Williams](https://twitter.com/abraham) at the [SFHTML5 Meetup](https://www.meetup.com/de-DE/sfhtml5/events/256523273/) hosted by Google in San Francisco a few weeks ago, I decided to give it a try. I developed a little a small [bookmark manager](https://github.com/n1try/anchr-android) app for Android while attempting to learn Flutter.

# What is Flutter?
Flutter is an open-source framework for developing cross-platform mobile apps. Or in their own words it ...
> [...] allows you to build beautiful native apps on iOS and Android from a single codebase. 

"Cross-platform" means that you develop an app that can run on multiple platforms, in this case, Android, iOS and (in the future) also [Fuchsia](https://en.wikipedia.org/wiki/Google_Fuchsia). Traditionally, you would have to write the same app multiple times, e.g. once in Java for Android and a second time in Swift for iOS. This is a pain for developers, obviously, and Flutter tries to overcome it. 

There are already several approaches out there, trying to solve cross-platform mobile development. They include **hybrid** app frameworks like [Ionic](https://ionicframework.com/) and [Cordova](https://cordova.apache.org/) as well as **native cross-platform** frameworks like [React Native](https://facebook.github.io/react-native/), [NativeScript](https://www.nativescript.org/) and [Xamarin](https://visualstudio.microsoft.com/xamarin/).

By the way, there is is a very interesting comparison of [Ionic vs. React Native](https://www.codementor.io/fmcorz/react-native-vs-ionic-du1087rsw). 

While hybrid frameworks basically render a website to the device's screen and native frameworks translate TypeScript (or C#) code into native iOS / Android components, Flutter ["works more like a game engine"](https://buildflutter.com/how-flutter-works/). It has an extremely efficient engine that layouts widgets and renders them to a canvas. Therefore it usually a lot faster and less laggy than hybrid frameworks. 

Unlike most other cross-platform frameworks, where you usually program in JavaScript (or C# in the case of Xamarin), Flutter relies on [Dart](https://dartlang.org), created by Google. Consequently, in order to learn Flutter, you would usually not only have to learn the framework itself, but also a new programming language. This may seem like a high entry barrier, but it actually is not.

# Pros
## What I **DO** like about Dart
1. **It looks familiar.** Dart really just feels like Java and JavaScript having a baby. It does not follow any exotic paradigms. Instead, if you know Java and JavaScript, learning Dart is quite easy since there are only very few new concepts and syntaxes. 
For instance, it is **object-oriented** and has a proper inheritance system, similar to Java. In addition, it has a **static typing system**, including generics, but with **optional type declarations**, similar to Scala.
JavaScript people will find well-known concepts as well, such as **futures, generators and `async / await`**.
Similar to Scala's _traits_, Dart even supports a kind of **multiple class inheritance** using _mixins_, which is quite handy once you get used to it. Having a Java background another cool new thing in Dart is **factory constructors**.
2. **It feels consistent.** What I did not like about TypeScript is that sometimes it just feels a bit hacky, e.g. when third-party typings for a certain library are buggy or even missing. In my opinion, this originates in TypeScript's approach of trying to extend an existing programming language with whole new functionality. While TypeScripts is still a great language, Dart just feels more consistent in its whole. It was designed completely from scratch with all the above concepts in mind and since it is quite young, it still feels clean and minimalistic. However, since it is not that widely used, yet, the ecosystem (including tooling, libraries, ...) is way smaller compared to JavaScript or native Android / iOS.
3. **It is multi-purpose.** Dart can not only be used for mobile development but is quite generic. You can use it to write your backend and there are transpilers to use it in the browser as well. Since frameworks like Angular start to have Dart support (see [AngularDart](https://webdev.dartlang.org/angular/)), I feel like it could [gain popularity](https://medium.com/@mswehli/why-dart-is-the-language-to-learn-of-2018-e5fa12adb6c1) in the next years. 
4. **It has named parameters 😃.** They exist in many programming languages, including Python and Scala and I really got used to them. In my opinion, code gets a lot cleaner with named parameters. 

## What I **DO** like about Flutter
1. **Easy layouting.** Dart follows the paradigm that _"everything is a widget"_. So instead of defining layouts with XML (like in Android) or with HTML + CSS (like in the web), everything is done programmatically. The way you build components is by recursively nesting widgets into other widgets. Such might include UI components like a `TextView` and `FloatingActionButton` or more abstract things like a `GestureDetector` or `Padding`. The structure is always the same and that makes UI composition easy to me.
2. **Tons of built-in components.** Flutter comes with a giant [catalog of widgets](https://flutter.dev/docs/development/ui/widgets) for layouting, styling, animations and UI components (all of which perfectly follow Material design). So far I could find everything I needed in the widget catalog without having to use any poorly-maintained third-party libs.
3. **It feels so real.** Often times, hybrid apps still do not completely feel like a real app, even if they are using Material design libraries etc. Maybe the navigation drawer's sliding animation is too rough, a page transition is slightly laggy or the text style just does not look quite right. At least this is what I experienced with Ionic. With Flutter, however, I could not tell the difference compared to a truly native app. Everything is super fast, smooth and pixel-perfect. 
4. **It is future-proof.** Google is pushing Flutter really hard as they keep posting blog articles and developer videos about it. I feel like they really want people to adopt it, which might relate to their development on Fuchsia. No matter whether or not they are planning to [replace Android with Fuchsia](https://www.reddit.com/r/androiddev/comments/6aga8e/in_your_opinion_will_google_fuchsia_replace/) some day, Flutter is definitely a good thing to know.
5. **Good tooling.** Although the ecosystem around Flutter is not that big, yet, the built-in tooling is great. Flutter comes with an intuitive **CLI** and is well integrated with my favorite editors IntelliJ (**Android Studio**) and **Visual Studio Code**. 
6. **Open-Source.** I love open-source, so I am glad that Flutter is completely open to the community and available on [GitHub](https://github.com/flutter/flutter). 

# Cons

## What I **DO NOT** like about Dart
1. **No functional APIs.** I do not expect a functional programming language like Scala, but since I really got used to Java 8's stream API, I am a bit sad that Dart has almost no functional APIs. In my opinion, code gets a lot cleaner with such.

## What I **DO NOT** like about Flutter
1. **Is it truly cross-platform?** This is rather a question than something I strictly do not like. So far, I only developed an Android app with Flutter and I wonder whether it is actually possible to use the exact same code for iOS. Sometimes you will still need to access native APIs, e.g. when attempting to [receive a sharing intent](https://muetsch.io/how-to-receive-sharing-intents-in-flutter.html), or have varying design elements. So although I am not totally sure about this, I would assume that for large projects you would still need to write two separate Flutter apps for Android and iOS, but have the ability to reuse large parts of the code in form of a shared library. 
2. **Apps are large.** Maybe this will be improved in the future, but right now Flutter apps are pretty large. My [simple bookmark manager](https://github.com/n1try/anchr-android) is 46 MB in size when installed.

# Where to get started?
If you want to start learning Flutter, I would recommend the following. 
1. Take the [Tour of Dart](https://www.dartlang.org/guides/language/language-tour) and get familiar with Dart's syntax and concepts.
2. Walk through [A month of Flutter](https://bendyworks.com/blog/a-month-of-flutter) to start building a real-world Flutter app step-by-step.

Have fun and happy coding! 🤓