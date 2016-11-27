const {E} = require('./utils');

const navigation = [
  {
	key: `random_quote`,
	name: E(':game_die: Random quote'),
	handler: (message) => {
		console.log("YEY NAV")
	}
  },

  {
	key: `categories`,
	name: E(':checkered_flag: Categories'),
	handler: (message) => {
	  console.log("YEY NAV")
	}
  }
];

function navigateOrNext(message,next){
  let navigateTo = filterNavigation(message.body);
  if(navigateTo){
	// A fixed navigation item was chosen. No need to send request to Api.ai
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

 module.exports = {
   navigateOrNext,
   navigationItems
 }
