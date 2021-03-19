---
title: My Experiences with the Oracle Java 11 Developer Certification
date: 2021-03-19 13:03:30
tags:
---

![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/java_cert2.png)

On the occasion of the Java programming language's 25th anniversary, Oracle just recently announced a pretty nice discount on the _Java 11 SE Developer Certification_. For a limited period of time you can get the exam, which normally costs something around $ 250 and the accompanying course, which, I believe, is even more expensive, for a total of $ 25.

 At [Frachtwerk](https://frachtwerk.de), we decided to take the chance and give all backend developers the opportunity to get certified. Today, I had my exam and here are my thoughts on the journey to get there.

## The Course
The course's target audience includes developers, who already have a decent amount of experience with programming in Java, but not necessarily are experts, yet. Motivation for taking the course could be to further improve your skills or to specifically prepare for the certification. A certification like this, in turn, can help developers set themselves apart from potential competitors on the job market.

I, personally, have been developing web applications in Java for a few years now and would consider my experience and language skills fairly advanced. However, I was surprised how much I could still learn, though. I even got to know feature of Java that I haven't had heard of before.

Contents of the course range from the most essential things like types, variables, loops and conditions over inheritance principles, streams, I/O and JDBC throughout to low-level multi-threading and concurrency concepts and details about the fairly new Java 9 module system.

![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/java_cert1.png)

Overall, my experience with the course was very good! All content is of overly high quality, explanations are clear and understandable and the topics covered are not at all only superficial, but indeed quite advanced. At the end of each section there are quizzes for reviewing your knowledge. 

Here are a few examples of such questions:

![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/java_cert6.png)
![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/java_cert4.png)
![](https://apps.muetsch.io/images/o:auto/rs,s:640?image=https://muetsch.io/images/java_cert5.png)

Experienced Java developers might easily skip the first ten chapters, however, the higher ones were actually very interesting to me.

Among others, I got to learn about how [type erasure](https://docs.oracle.com/javase/tutorial/java/generics/erasure.html) of generics works, what [heap pollution](https://docs.oracle.com/javase/tutorial/java/generics/nonReifiableVarargsType.html#heap_pollution) is, how the `volatile` type modifier functions and that [interfaces can have private, non-abstract methods](images/java_cert3.png).

Especially since it is free, I would definitely recommend the course, even to experienced Java developers. 

## The Exam
After I had spent about 1.5 full work days for preparation, I eventually felt confident enough to register for the exam. It takes place online and you can choose from a variety of different dates and times. 

I was perfectly satisfied with the learning path so far. However, there were a few points about the exam which I did not quite like that much.

While the certification program itself is offered by Oracle, the exam takes place through an external provider called Pearson VUE. Being spezialized on online exams, they take various measures to prevent cheating. In principle, this is a positive thing. I could not take a certificate seriously if I knew that you could google during the exam or do partner work. However, in my opinion, things were a bit too strict here.

First of all, you have to download and install a desktop application through which the exam itself is conducted. Unfortunately, it is only available for Windows and Mac and it turned out to be non-trivial to find a non-Linux computer with webcam and microphone at our office. The program runs full-screen and you can not exit to your desktop or other programs from it, which makes sense. Also, it automatically kills processes like `teamviewer.exe`, `anydesk.exe` and all kinds of software you might be able to use for cheating. 

Before the exam starts, you are assigned an instructor, who, apparently, is an employee at Pearson VUE, sitting in a call center somewhere. He or she asks you to upload pictures of your surrounding environment, including your desk. Also, you need to provide your ID card. The guy asked me to remove nearly everything except my notebook from my desk. You are not allowed to have pen and paper on your desk, no smartphone, no smartwatch, no food or drinks, except water. 

So far so good. However, at some point, things started to get a little ridiculous for my taste. I have an external monitor on my desk, which I was asked to unplug and show the unplugged power supply cable on webcam. During the exam, you are constantly being monitored through cam and microphone. If your face disappears on the webcam, you failed. If another person enters the room, you failed. A point at which I started to get annoyed was when the guy told me to not speak and not move my lips. I tend to speak questions and answers to myself while I analyze and think about them. Not allowed. I wanted to take a short break for a moment and look out of the window. Immediately, the guy reached out to me to remind me that if I looked away from my screen again, he would have to cancel my exam. Being monitored in such a strict way was distracting. 

Eventually I passed the exam after 90 minutes and 50 multiple-choice coding questions and got my certificate. The only disappointing thing about it is the fact that my last name, `Mütsch` is actually written `M%C3%Btsch` on it. I would not have guessed that non-ASCII characters like German umlauts would still be a problem in 2021. But anyway, I am happy that I passed the exam, which, indeed, was way harder than I would have expected.

All in all, I am still happy with this experience and would recommend it to any Java developer, too. 