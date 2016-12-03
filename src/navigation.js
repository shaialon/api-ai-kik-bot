const Bot  = require('@kikinteractive/kik');
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
	  //message.reply(`Categories are coming soon...`)
	  message.reply(
		addNavigationElements(
		  Bot.Message.text(E(`Choose a category!`)),
		  categories
		)
	  )
	}
  }
];

const categories = [
  {
	id: 'love',
	name: 'Love'
  },
  {
	id: 'friendship',
	name: 'Friendship'
  },
  {
	id: 'innovation',
	name: 'Innovation'
  },
]


function navigationMiddleware(message,next){
  let navigateTo = filterNavigation(message.body);
  // Main navigation
  if(navigateTo){
	// A navigation item was chosen. No need to send request to Api.ai
	console.log(`${message.from}  - Resolve in Navigation: chat ${message.chatId}`);
	return navigateTo.handler(message);
  }

  // Categories
  navigateTo = filterNavigationCategories(message.body);
  if(navigateTo){
	// A navigation item was chosen. No need to send request to Api.ai
	console.log(`${message.from}  - Resolve in Navigation Categories: chat ${message.chatId}`);
	return handlers.quote_search(message, {parameters:{any: navigateTo.id}});
  }

  next();
}

function filterNavigation (text) {
  if(typeof text !== 'string'){return null;}
  return navigation.filter(e => e.name === text)[0];
}

function filterNavigationCategories (text) {
  if(typeof text !== 'string'){return null;}
  return categories.filter(e => e.name === text)[0];
}

function navigationItems () {
  return navigation.map(e => e.name)
}

function addNavigationItems (msg) {
  return addNavigationElements(msg, navigation);
}

function addNavigationElements (msg, elements) {
  elements.forEach(e => {
	msg = msg.addTextResponse(e.name);
  });
  return msg;
}

module.exports = {
 navigationMiddleware: navigationMiddleware,
 navigationItems: navigationItems,
 addNavigationItems: addNavigationItems
}
