const apiai = require('apiai');
const uuid = require('node-uuid');
const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG || 'en';
const apiAiService = apiai(APIAI_ACCESS_TOKEN, {language: APIAI_LANG, requestSource: "kik"});
const sessionIds = new Map();
const {handlers} = require('./handlers');


const textMiddleware = (message, next) => {
  console.log(`${message.from} - Resolve in Api.ai: chat ${message.chatId}`);

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
}

// Helpers
function isDefined(obj) {
  if (typeof obj == 'undefined') {
	return false;
  }

  if (!obj) {
	return false;
  }

  return obj != null;
}

module.exports = {
  textMiddleware,
}
