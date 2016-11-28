
// Imports
const Bot  = require('@kikinteractive/kik');
const {E} = require('./utils');
const {getGif} = require('./gifs');
const quotes = require('./quotes');

// Handlers
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
	  gifMessage(getGif('robot_fail')).setTypeTime(2000),
	  lastMessage(`Maybe try something else?`)
	])
  }
};

// Helpers
function nameFromParams (params){
  if(!params) {return '';}
  return `${params['given-name']} ${params['last-name']} ${params['music-artist']}`.replace(/ +(?= )/g,'').trim();
}

function lastMessage (text){
  return require('./navigation').addNavigationItems(
	Bot.Message.text(E(text))
  );
}

function gifMessage (url){
  return Bot.Message.video(url).setAutoplay(true).setLoop(true);
}


// Exports
module.exports = {
  handlers
}
