'use strict';

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const request = require('request');

const REST_PORT = (process.env.PORT || 5000);
const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG || 'en';

const apiAiService = apiai(APIAI_ACCESS_TOKEN, {language: APIAI_LANG});
const sessionIds = new Map();



//Create a server to prevent Heroku kills the bot
const server = express();

//Lets start our server
server.listen((process.env.PORT || 5000), () => console.log("Server listening"));