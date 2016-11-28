const {E} = require('./utils');
const {handlers} = require('./handlers');

const navigation = [
  {
	key: `random_quote`,
	name: E(':game_die: Random quote'),
	handler: (message) => {
		handlers.quote_search(message,{});
	}
  },

  {
	key: `categories`,
	name: E(':checkered_flag: Categories'),
	handler: (message) => {
	  console.log("YEY NAV2")
	}
  }
];

function navigationMiddleware(message,next){
  let navigateTo = filterNavigation(message.body);
  if(navigateTo){
	// A navigation item was chosen. No need to send request to Api.ai
	console.log(`${message.from}  - Resolve in Navigation: chat ${message.chatId}`);
	return navigateTo.handler(message);
  }
  next();
}

function filterNavigation (text) {
  if(typeof text !== 'string'){return null;}
  return navigation.filter(e => e.name === text)[0];
}

function navigationItems () {
  return navigation.map(e => e.name)
}

function addNavigationItems (msg) {
  navigation.forEach(e => {
	msg = msg.addTextResponse(e.name);
  });
  return msg;
}

module.exports = {
 navigationMiddleware: navigationMiddleware,
 navigationItems: navigationItems,
 addNavigationItems: addNavigationItems
}
