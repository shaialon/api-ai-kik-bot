'use strict';

const quotesArr = require('./quotes_array');
// Prepare quotes for Search:
const quotesSearchable = quotesArr.map(quote => {
  return Object.assign({},quote,{
	authorLower: quote.author.toLowerCase(),
	authorClean: stripStr(quote.author),
  });
});

// Utils
function stripStr(phrase){
  return phrase.trim().replace(/[\?'.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
}
function sample(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

// Handlers
function getRandom() {
   return sample(quotesSearchable);
}
function getByAuthor(authorName) {
  let exact = [], partial = [];
  let authorLower = authorName.toLowerCase(), authorClean = stripStr(authorName);

  quotesSearchable.forEach(quote => {
	if(quote.authorLower == authorLower){
	  exact.push(quote);
	}
	else if(quote.authorClean.indexOf(authorClean) >= 0 ){
	  partial.push(quote);
	}
  });
  console.log(`Found ${exact.length} Exact Matches and ${partial.length} for ${authorName}`);
  if(exact.length > 0){
	return sample(exact);
  }
  if(partial.length > 0){
	return sample(partial);
  }
  return null;

}

function getStats() {
  let authors = {}, tags = {};
  quotesSearchable.forEach(quote => {
	authors[quote.author] = authors[quote.author] ? (authors[quote.author]+1) : 1;
	tags[quote.tag] = tags[quote.tag] ? (tags[quote.tag]+1) : 1;
  });
  console.log(tags);
}

console.log(getStats());

module.exports = {
  quotesArr,
  getRandom,
  getByAuthor
}
