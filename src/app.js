'use strict';
const Bot  = require('@kikinteractive/kik');

const request = require('request');
const http = require('http');


const {navigationMiddleware, navigationItems} = require ('./navigation');
const {textMiddleware} = require('./text_input');

const REST_PORT = (process.env.PORT || 8083);
const KIK_API_KEY = process.env.KIK_API_KEY;
const SERVICE_URL = process.env.APP_NAME ?
    `https://${process.env.APP_NAME}.herokuapp.com` :
    'https://shaikik.ngrok.io';

let bot = new Bot({
    username: 'rollagame',
    apiKey: KIK_API_KEY,
    baseUrl: SERVICE_URL,
    staticKeyboard: new Bot.ResponseKeyboard(navigationItems())
});

// Update Webhook endpoint + staticKeyboard.
bot.updateBotConfiguration();

// On initial open of chat window
//bot.onStartChattingMessage((message) => {
//    bot.getUserProfile(message.from)
//      .then((user) => {
//          const message = Bot.Message.text(`Hey ${user.firstName}! Nice to meet you, I'll be your own personal assistant 🤖`)
//            .addTextResponse('Random game');
//
//          incoming.reply(message)
//      });
//});

// Was a navigation item clicked?
bot.onTextMessage(navigationMiddleware);

// Resolve text query in api.ai
bot.onTextMessage(textMiddleware);


const server = http
    .createServer(bot.incoming())
    .listen(REST_PORT);
