---
title: My experiences with the Android Developer Nanodegree
date: 2019-01-26 09:01:50
tags:
---

Last year from March to August I participated in Udacity's [Android Developer Nanodegree](https://www.udacity.com/course/android-developer-nanodegree-by-google--nd801) program and here I want to share my experiences. 

Originally, I got an ad on Facebook to apply for a scholarship offered by Google and Udacity for the Nanodegree program, which normally costs ~ 900 €. I had done very few Android development before and although I did not particularly want to prepare for a career as an Android developer, I was definitely interested in learning Android more thoroughly. However, as we all know, it is very hard to find motivation to learn a new technology without having a real, serious project to build. Consequently, I applied for the scholarship and I was lucky (thanks to Google and Udacity for this opportunity!). 

# The Nanodegree
## Time Management
When participating in a Nanodegree program, you usually have six months to complete it. Due to classes at university, I only had time to start in my, so essentially I had three months to complete it. But since I was not a complete beginner, that was totally manageable.

Udacity suggests a schedule for when to do which module of the course as well as soft deadlines for the finals projects at the end of every learning section. However, that is only a suggestion. The only hard deadline is the submission of the very final project. Personally, I decided to take two days in a week to fully focus on learning and coding for the Nanodegree. 

## Structure 
This specific Nanodegree program consisted of five major sections.

1. Developing Android Apps
2. Advanced Android App Development
3. Gradle for Android and Java
4. Material Design for Android Developers
6. Capstone Project

Every section consists of several **(1) video lessons**, in which Udacity developers explain concepts and do live coding. Between lessons, there are **(2) quizzes** to test your gained knowledge, however, the quizzes were usually quite easy and obvious. In addition to that, there are several **(3) coding tasks**, which require you to practically apply the newly learned concepts. Every coding task starts with an unfinished, small toy app and a list of TODOs you have to fulfill in order to finish it. The TODOs tell you quite precisely what to do, so sometimes it was not really a challenge. Also, you do not have to do the coding tasks at all, if you do not want to, because nobody checks your results. But obviously it makes sense to do them and it helps a lot for the **(4) project app** at the end of each section (sometimes there are more than one). For this project, you are told to implement an app with a certain functionality (e.g. a cooking recipe manager, a movie collection manager, an RSS reader, etc.). Usually it starts off with a raw scaffolded app skeleton which you have to finish - this time without specific TODOs or instructions. At the end, you submit your code either via a GitHub repository or as a ZIP file and a Udacity mentor will review your code and give you helpful feedback regarding functionality, design and code style. 

Here are three of my section-end project apps:

1. **[popular-movies-android](https://github.com/n1try/popular-movies-android):** App for displaying movie information fetched from an online movie database. Focus was on interacting with an external, third-party web API.
2. **[baking-time-android](https://github.com/n1try/baking-time-android):** App for showing baking recipes and instructions. Focus was on widgets, responsive design and integrating a video player.
3. **[xyz-reader-android](https://github.com/n1try/xyz-reader-android):** Basic reading app for text articles. Focus was on properly implementing Material Design, animations and UX.

## Community
Probably the best thing about the whole course was the community. There is an official Slack channel and a forum full of like-minded developers from literally all around the world who are going through the same experience like you. People ask questions, discuss about certain tasks or technology in general and you immediately feel extremely welcome. Whether you are unsure about a task or cannot get a certain error fixed, there are people who will help you. Also, a lot of Udacity mentors hang out on Slack and in the forum and provide support as well, e.g. in form of weekly AMA sessions. In addition to that, every participant of the course is assigned a personal mentor, who is a Udacity mentor that you can contact directly of you have questions. Actually, I did never contact mine, but I am sure they are willing to help.

## Career Boost
Despite the fact that having a Nanodegree looks quite good on your resumé anyway, Udacity also provides a lot of support to help you building a successful career with your newly gained Android knowledge. They provide information and support for your application, review your CV and more.

## The Capstone project
At the very end of the course, there is the so called **Capstone project** and this was the most fun part during the whole Nanodegree (and also the greatest effort). You are given the task to freely realize any app you like, given some requirements, e.g. that you use at least three third-party libraries, follow Material Design guidelines, provide a homescreen widget and a few more. 

The final project consists of two parts. First, you have to submit a design proposal, which includes your app idea, some mock-ups and details on how you plan to implement it. After your design has been approved by Udacity mentors, you can start with phase 2, the actual implementation.

![](images/cert.png)

# QuizNerd
![](images/qn_feature.png)

At that time I had a few coding interviews, so I came to the idea to implement a multi-player coding quiz game as a final project. Although that was probably a more comprehensive project than most of the others, I still wanted to do it, especially because it was an app I really wanted to have for myself, not only for the Nanodegree. 

I spent approximately two weeks of nearly full-time coding on that final project and finally came up with my app called QuizNerd. It is implemented in pure Android (using Java) without any structural frameworks (e.g. like [Dagger](http://square.github.io/dagger/)) and uses Google's [Firebase](https://firebase.google.com/) as a backend. More precisely I used Firebase Authentication for user management, [Firestore](https://firebase.google.com/docs/firestore/) as a real-time document database, FCM for notifications and and Firebase [Cloud Functions](https://firebase.google.com/docs/functions/) as a Serverless framework for backend-side logic. 

If you are a developer who likes games like [QuizClash](https://play.google.com/store/apps/details?id=se.feomedia.quizkampen.de.lite), I would love to have you try out QuizNerd! You can find it on the [Play Store](https://play.google.com/store/apps/details?id=com.github.n1try.quiznerd) and it has several hundred questions for Android, C++, C#, HTML, Java, JavaScript, PHP, Python and Swift. Feel free to share your feedback with me 🙂.

![](images/qn2.png)

# Conclusion
It was fun! I learned a lot during the Nanodegree and I am kind of confident calling myself an Android developer now. Most of the concepts were explained very detailed. Fore instance one of my favorite chapters was the one about Gradle, where they precisely explained how Gradle works, how to write own Gradle tasks and how to apply that to Android.

If you keep on motivating yourself to work through the lessons and especially through the final project, it is going to pay off. Moreover, in addition to precious programming knowledge, you also get to know a lot of interesting people from the community all over the world. 

However, there is two things I would want to criticize. Firstly, nowadays Java is rapidly becoming less popular for Android development, while Kotlin is considered the future. Many professional developers who I have talked to claim that it does not make a lot of sense today to still start a new Android project with Java instead of Kotlin, so I wish the Nandogree was based on Kotlin in order to be even more future-proof. Also, de-facto standard frameworks like Dagger were not mentioned throughout the course, while (in my opinion) less useful things like homescreen widget had been pushed by Udacity. Maybe that is going to change in newer versions of the course.

The second thing is that, as I mentioned earlier, the TODO-tasks in the final projects of every section were too specific and too fine-grained. Sometimes I found myself just stupidly doing exactly what the TODOs wanted me to do instead of trying to capture a more high-level picture and solve design problems by myself. 

That being said, I would recommend the Udacity Nanodegree to everyone who is interested in becoming an Android developer. Have fun!

# Links
* [QuizNerd on Google Play](https://play.google.com/store/apps/details?id=se.feomedia.quizkampen.de.lite)
* [Collection of Nanodegree 2018 final projects](https://google-udacity-scholars18.github.io/and/)