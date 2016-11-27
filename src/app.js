'use strict';

const apiai = require('apiai');
const Bot  = require('@kikinteractive/kik');
const uuid = require('node-uuid');
const request = require('request');
const http = require('http');
const quotes = require('./quotes');

const {sample, E} = require('./utils');
const {navigateOrNext, navigationItems} = require ('./navigation');

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
    baseUrl: SERVICE_URL,
    staticKeyboard: new Bot.ResponseKeyboard(navigationItems())
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

bot.onTextMessage(navigateOrNext);

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
            }
        });

        apiaiRequest.on('error', (error) => console.error(error));
        apiaiRequest.end();
    }
});

function nameFromParams (params){
    if(!params) {return '';}
    return `${params['given-name']} ${params['last-name']} ${params['music-artist']}`.replace(/ +(?= )/g,'').trim();
}


const handlers = {
    'quote_search' : (message, aiResult) => {
        let name = nameFromParams(aiResult.parameters);
        //message.reply(`Searching for quotes by ${name}`);
        let quote = name.length > 0 ? quotes.getByAuthor(name) : quotes.getRandom();
        if(quote){
            // Quote found!
            message.reply([
                //gifMessage(),
                lastMessage(`${quote.quote}\n\n~ ${quote.author}`).setTypeTime(1000),
            ]);
        }
        else {
            // Quote not found!
            message.startTyping();
            bot.getUserProfile(message.from)
              .then((user) => {
                  message.reply([
                      lastMessage(`I have failed you ${user.firstName}, nothing found! Great, just what I need...\n\nMy mom tells me I should have gone to law school to become of those lawyer bots :robot_face::scroll:`).setTypeTime(1000)
                  ]);
              });

        }

    },
    'input.unknown' :(message, aiResult) => {
        message.reply([
            E(`Oooops I'm confused :confused:`),
            gifMessage(sample(failImages)).setTypeTime(2000),
            lastMessage(`Maybe try something else?`).setTypeTime(5000)
        ])
    }
};


function lastMessage (text){
    return Bot.Message.text(E(text))
              .addTextResponse(E(':game_die: Random quote'))
              .addTextResponse('Categories')
}

function gifMessage (url){
    return Bot.Message.video(url).setAutoplay(true).setLoop(true);
}

const failImages = [
    `https://media.giphy.com/media/N8wR1WZobKXaE/giphy.gif`,
    `https://media.giphy.com/media/3o85xwc5c8DCoAF440/giphy.gif`,
    `https://media.giphy.com/media/v7QyD3p5TvDfG/giphy.gif`,
    `https://media.giphy.com/media/4d51HHDLd8BPy/giphy.gif`,
    `https://media.giphy.com/media/dKs4NntOpkFRm/giphy.gif`
]

const server = http
    .createServer(bot.incoming())
    .listen(REST_PORT);
