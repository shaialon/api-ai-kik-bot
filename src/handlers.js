
// Imports
const Bot  = require('@kikinteractive/kik');
const {E} = require('./utils');
const {getGif} = require('./gifs');


// Handlers
const handlers = {
  'quote_search' : (message, aiResult) => {
	const quotes = require('./quotes');
	let query = paramsToQuery(aiResult.parameters);
	let quote;
	console.log(query);
	if(query.author || query.search){
	  quote = quotes.getByQuery(query)
	}
	else {
	  quote = quotes.getRandom();
	}

	if(quote){
	  // Quote found!
	  message.reply([
		//gifMessage(),
		lastMessage(`${quote.quote}\n\n~ ${quote.author}`),
	  ]);
	}
	else {
	  // Quote not found!
	  message.reply([
		lastMessage(`I have failed you, nothing found! Great, just what I need...\n\nMy mom tells me I should have gone to law school to become of those lawyer bots :robot_face::scroll:`).setTypeTime(1000)
	  ]);

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
function paramsToQuery (params){
  let query = {};
  if(!params) {return {};}

  let author = nameFromParams(params);
  query.author = author.length >0 ? author : null;

  if(params.any){
	query.search = params.any;
  }
  return query;
}

function nameFromParams (params){
  if(!params || !params['given-name']) {return '';}
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
