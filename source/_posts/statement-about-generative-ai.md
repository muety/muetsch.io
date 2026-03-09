---
title: Statement about generative AI
date: 2024-06-13 08:46:14
tags: [ai, machine-learning]
---

---

## Update 2026-03-09
**I've changed my mind.** At least for the coding part. I came to the realization the software engineering will inevitably change and ignoring this fact wouldn't probably be the smartest move. As AI-assisted coding and – especially – the tooling around it is evolving, I can quite clearly see where things are moving towards now. 

Software eningeering (and with it the role of the software engineer) shifts from writing actual code towards precisely **instructing** some coding agent and afterwards **reviewing** its output. The middle part of doing actual _programming_ is delegated to AI, because it's just insanely more efficient at it (as my colleague put it: AI-assisted coding is like working with a skilled junior dev on cocaine).

For me, personally, this is somewhat disappointing, because I particularly liked this "dirty work". But that's how it does, I guess ...

The good part is: I can also still learn a lot from the code that my LLM of choice outputs (e.g. just recently I learned about [`PARTIAL INDEX`](https://www.postgresql.org/docs/current/indexes-partial.html) in Postgres, which was exactly the right tool for what I was trying to accomplish). Also, I'm simply becoming a lot more productive thanks to AI and my endless list of "maybe some time in the future" side project ideas becomes a little more likely to ever get done. 

For my **professional work**, I've decided to jump on the bandwagon of AI-assisted coding (not to be confused with brainrot vibe-coding), because anything else would be foolish. For my **hobby projects** (especially Wakapi.dev), I'll probably keep hand-coding large portions, but also won't refuse to use AI on principle. For **blogging**, everything will remain **100 % hand-written**.

However, as I still care a lot about data privacy and -sovereignity, I try hard to use free and open-source software (such as [OpenCode](https://opencode.ai), [Goose](https://block.github.io/goose/), [Ollama](https://ollama.com), ...) and open-weights models (preferably hosted at European cloud providers like [Scaleway or Ionos](https://muetsch.io/eu-hosted-llm-coding-assistant-via-ionos-ai-model-hub-in-vscode-and-jetbrains.html)) as far as popssible. I boycott ChatGPT / OpenAI for moral reasons, but occasionally use Gemini or Claude Code where the OSS models hit their limits. Maybe I'll blog about my dev setup in more detail at some point.

---

# Intro 

Inspired by [these](https://www.leftfold.tech/pages/noai/) [two](https://antonz.org/ai-free/) blog posts, I want to make a statement about the use of generative AI on my sites and in my projects. All content you'll find here is **written by human** (that is, primarily by myself).

I don't intend to damn recent advanced in LLMs and gen-AI for synthesizing text, code, pictures and videos. The progress made on that end is super impressive and generative deep learning methods are an extremely interesting research area. By no means do I think that these evolvements are just a hype. ChatGPT, LLaMA, Stable Diffusion, Whisper & Co. are here to stay and I am convinced they will sort of revolutionalize the way we work as creators and developers (in a good or bad way). Possibly, we'll even get to AGI not too far in the future.

However, I think there are non-negligible risks, including such related to privacy, the individual power of very few, big tech companies ([NVIDIA](https://x.com/historyinmemes/status/1800966548867383364), OpenAI, ...) and - first and foremost - disinformation. Also, similar to Richard Stallman (referring to his article on [_Reasons not to use ChatGPT_](https://stallman.org/chatgpt.html)), I'm being reluctant about actually considering LLM systems "intelligent". While referring to them as ["bullshit generators"](https://www.gnu.org/philosophy/words-to-avoid.html#ArtificialIntelligence) - as GNU / Linux philosophy suggests - is probably a bit harsh, you might well argue that those types of models are rather just giant databases with pretty good human-language query interface.

Anyway, I don't want to go into a deeper discussion any about these points - there are a lot of great blog posts and books out there. I just want to state my current position on the overall topic.

# Writing and coding for fun

Quoting from the blog post referenced above: 

> Writing, to me, isn't a chore. It's not a tool to generate traffic or attention. It's a form of expression [...]

Same for coding. I do this for fun. When I'm writing a blog post, it's not because I seek to attract a lot of clicks. It's because I discovered something that I feel is worth sharing with likeminded people. And when I'm writing code, I'm doing so for the sake of the thing itself. I don't regard programming as a means to an end, but as part of the journey. I enjoy to wrap my head around some problem, dig into the documentation of some library and do trial & error debugging until my program eventually works - even though Copilot or sth. might have done it a lot faster.

[This excellent article](https://nmn.gl/blog/ai-and-learning) elaborates on the concerning phenomenon that young, unexperienced developers tend to lack foundational understanding about programming and postulates a thesis that gives food for thought.

> We're trading deep understanding for quick fixes, and while it feels great in the moment, we’re going to pay for this later.

Judging from my learning path, I totally agree with the statement that "reading discussions by experienced developers [e.g. on StackOverflow] about your topic is the best way to learn". Getting code to work is easy today, but comprehending how and why it works is at least equally as important. For that reason, I encourage every aspiring developer to opt for the rocky road.

Apart from that, I also just feel a lot more comfortable to read blog posts and StackOverflow answers written by actual human experts - like senior devs with yearslong experience or researchers of that area - than AI content. If a blog post sounds like ChatGPT, I usually skip and move on. Also, personally, I find it somewhat disappointing that events like Google I/O or Apple WWDC - that used to be famous for dropping exciting new dev features and sparking nerdy tech talk among colleagues each time - have mostly turned into AI bulls*** bingo. Just my two cents.

**Long story short is:** all content on this blog and all code in my projects is purely written by myself. Just to let you know ...
