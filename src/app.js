'use strict';

const apiai = require('apiai');
const Bot  = require('@kikinteractive/kik');
const uuid = require('node-uuid');
const request = require('request');
const http = require('http');
const quotes = require('./quotes');

const REST_PORT = (process.env.PORT || 8083);
const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG || 'en';
const KIK_API_KEY = process.env.KIK_API_KEY;
const SERVICE_URL = 'https://shaikik.ngrok.io' || "https://" + process.env.APP_NAME + ".herokuapp.com";

const apiAiService = apiai(APIAI_ACCESS_TOKEN, {language: APIAI_LANG, requestSource: "kik"});
const sessionIds = new Map();

let bot = new Bot({
    username: 'rollagame',
    apiKey: KIK_API_KEY,
    baseUrl: SERVICE_URL
});

function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}

bot.updateBotConfiguration();

bot.onTextMessage((message, next) => {
    // message format from https://dev.kik.com/#/docs/messaging#receiving-messages
    console.log("chatId " + message.chatId);
    console.log("from " + message.from);

    let chatId = message.chatId;
    let messageText = message.body;

    if (messageText) {
        if (!sessionIds.has(chatId)) {
            sessionIds.set(chatId, uuid.v1());
        }

        let apiaiRequest = apiAiService.textRequest(messageText,
            {
               sessionId: sessionIds.get(chatId)
            });

        apiaiRequest.on('response', (response) => {
            console.dir(response.result, {colors:true});
            if (isDefined(response.result)) {
                let selectedAction = response.result.action;

                if(handlers[selectedAction]){
                    handlers[selectedAction](message, response.result);
                }
                else {
                    // Fallback
                    handlers['input.unknown'](message, response.result);
                }


                //if (isDefined(responseData) && isDefined(responseData.kik)) {
                //    try {
                //        // message can be formatted according to https://dev.kik.com/#/docs/messaging#message-formats
                //        console.log('Response as formatted message');
                //        message.reply(responseData.kik);
                //    } catch (err) {
                //        message.reply(err.message);
                //    }
                //} else if (isDefined(responseText)) {
                //    console.log('Response as text message');
                //    message.reply(responseText);
                //}
            }
        });

        apiaiRequest.on('error', (error) => console.error(error));
        apiaiRequest.end();
    }
});

function nameFromParams (params){
    return `${params['given-name']} ${params['last-name']} ${params['music-artist']}`.replace(/ +(?= )/g,'').trim();
}

const handlers = {
    'quote_search' : (message, aiResult) => {
        let name = nameFromParams(aiResult.parameters);
        //message.reply(`Searching for quotes by ${name}`);
        let quote = quotes.getByAuthor(name);
        if(quote){
            message.reply(`${quote.quote}\n\n~ ${quote.author}`);
        }
        else {
            message.reply(`I have failed you, nothing found. Great, just what I need...\n\nMy mom tells me I should have gone to  law school to become of those lawyer bots.`);
        }

    },
    'input.unknown' :(message, aiResult) => {
        message.reply(`Oooops you broke me :(\nHere is a random quote:`);
        let quote = quotes.getRandom();
        message.reply(`${quote.quote}\n\n~ ${quote.author}`);
    },
    //random_quote : (message, aiResult) => {
    //    //message.reply(`Here is a random quote`);
    //    let quote = quotes.getRandom();
    //    message.reply(`${quote.quote}\n\n~ ${quote.author}`);
    //},
};


const server = http
    .createServer(bot.incoming())
    .listen(REST_PORT);
