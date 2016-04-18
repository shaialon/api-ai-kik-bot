'use strict';

const apiai = require('apiai');
const Bot  = require('@kikinteractive/kik');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const request = require('request');
const http = require('http');

const REST_PORT = (process.env.PORT || 5000);
const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG || 'en';
const KIK_API_KEY = process.env.KIK_API_KEY;

const apiAiService = apiai(APIAI_ACCESS_TOKEN, {language: APIAI_LANG});
const sessionIds = new Map();

let bot = new Bot({
    username: 'apiai.bot',
    apiKey: KIK_API_KEY,
    baseUrl: 'https://xvir-kik.herokuapp.com/'
});

bot.updateBotConfiguration();

bot.onTextMessage((message) => {
    console.log("Message: " + message.body);
    message.reply(message.body);
});

const server = http
    .createServer(bot.incoming())
    .listen(REST_PORT);