## Telegram: ExpenseBot & DoodlerBot
May 08, 2016

In 2015, the [Telegram](https://telegram.org) messenger announced their [Bots](https://core.telegram.org/bots). Basically they are pieces of software that act like a normal chat user in many ways. They could have any functionality, from being helpful at daily tasks to even simple games or trivias – all within an ordinary Telegram chat. You send them message, they give answers – some more and some less intelligent. Recently, also other companies – like [Facebook](http://techcrunch.com/2016/04/07/facebook-chatbots/) or [Microsoft](https://dev.botframework.com/) – announced such bots for their messaging apps. Sometimes bots are even considered kind of the next step after native (web-) applications in the future.

From a developer’s perspective, making a bot is fun, because there are almost no restrictions on how to develop your bot. All communication with Telegram works by requesting a single REST API provided by them. Choices like which programming language and -framework to use and how to structure the code are completely up to the developer. A Telegram bot can theoretically be built in any programming language. The only requirements are to be able to make HTTP request from the application and to have a server to host the bot on.

I’ve recently created two bots for Telegram that should each help with a daily task.

### ExpenseBot – Keep track of your finances

![1461614801_Money-Increase](assets/img/expensebot_icon.png)

This bot’s purpose is to help people manage their daily expenses and keep track of their financial situation. Users can add expenses from wherever they are using a few simple commands from within the chat and have an eye on how much they have spent in a month or a day. This obviates the need for confusing Excel spreadsheets or paper notes. You can reach the bot by sending a Message to *[@ExpenseBot](https://telegram.me/ExpenseBot)* in Telegram.

### DoodlerBot – Coordinate group appointments

![1462726473_calendar](assets/img/doodlerbot_icon.png)

My second bot helps users coordinate a group of people and find the right date for a common appointment, just like you might know from [doodle.com](http://doodle.com) (even though it doesn’t have anything to do with that commercial service, except for fulfilling the same need). Open a new doodle and let your mates in the group chat vote for their preferred date to finally make the best decision for everyone. You can reach the bot by sending a Message to *[@DoodlerBot](https://telegram.me/DoodlerBot)* in Telegram.

Both projects are completely independent, non-commercial and privately operated. If you have any questions our found a bug (both bots are still in beta phase and therefore might show some unexpected behavior), please contact me at @n1try or via e-mail. In both cases, you should first read a basic introduction on how to use the respective bot, by sending a message with */help* to it.

In case you like my bots, I’d be really happy if you rated them at [https://storebot.me/bot/expensebot](https://storebot.me/bot/expensebot) and [https://storebot.me/bot/doodlerbot](https://storebot.me/bot/doodlerbot). Have fun!