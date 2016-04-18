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

bot.onTextMessage((message) => {
    console.log("Message: " + JSON.stringify(message));
    
    let messageText = message.body;
    
    if (messageText) {
        // if (!sessionIds.has(sender)) {
        //     sessionIds.set(sender, uuid.v1());
        // }

        let apiaiRequest = apiAiService.textRequest(messageText,
            {
               // sessionId: sessionIds.get(sender)
            });

        apiaiRequest.on('response', (response) => {
            if (isDefined(response.result)) {
                let responseText = response.result.fulfillment.speech;
                let responseData = response.result.fulfillment.data;
                let action = response.result.action;

                if (isDefined(responseData) && isDefined(responseData.kik)) {
                    try {

                    } catch (err) {
                        message.reply(err.message);
                    }
                } else if (isDefined(responseText)) {
                    console.log('Response as text message');
                    message.reply(responseText);
                }

            }
        });

        apiaiRequest.on('error', (error) => console.error(error));
        apiaiRequest.end();
    }
});

const server = http
    .createServer(bot.incoming())
    .listen(REST_PORT);