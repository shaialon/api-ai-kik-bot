'use strict';
const Bot  = require('@kikinteractive/kik');

const request = require('request');
const http = require('http');


const {navigationMiddleware, navigationItems, addNavigationItems} = require ('./navigation');
const {textMiddleware} = require('./text_input');

const REST_PORT = (process.env.PORT || 8083);
const KIK_API_KEY = process.env.KIK_API_KEY;
const SERVICE_URL = process.env.APP_NAME ?
    `https://${process.env.APP_NAME}.herokuapp.com` :
    process.env.TUNNEL_SSL;

let bot = new Bot({
    username: process.env.KIK_USERNAME,
    apiKey: KIK_API_KEY,
    baseUrl: SERVICE_URL,
    staticKeyboard: new Bot.ResponseKeyboard(navigationItems())
});

// Update Webhook endpoint + staticKeyboard.
bot.updateBotConfiguration();

// On initial open of chat window
bot.onStartChattingMessage((message) => {
    console.log(`${message.from}  - Started chatting: chat ${message.chatId}`);
    bot.getUserProfile(message.from)
      .then((user) => {
          message.reply([
              addNavigationItems(Bot.Message.text(`Hey ${user.firstName}! Try searching for quotes by your favorite persona:\n"What did Madonna say about Britney?"`))
          ])
      });
});

// Was a navigation item clicked?
bot.onTextMessage(navigationMiddleware);

// Resolve text query in api.ai
bot.onTextMessage(textMiddleware);


const server = http
    .createServer(bot.incoming())
    .listen(REST_PORT);
