'use strict';
const {stripStr, sample} = require('../utils');
const quotesArr = require('./quotes_array');
// Prepare quotes for Search:
const quotesSearchable = quotesArr.map(quote => {
  return Object.assign({},quote,{
	authorLower: quote.author.toLowerCase(),
	authorClean: stripStr(quote.author),

	quoteLower: quote.quote.toLowerCase(),
	quoteClean: stripStr(quote.quote),
  });
});


// Handlers
function getRandom() {
   return sample(quotesSearchable);
}
function getByQuery(query) {
  let exactArr = [], partialArr = [];
  let filters = createFilters(query);
  // This is a
  quotesSearchable.forEach(quote => {
	let exact = true, partial = true;
	if(filters.author){
	  if(quote.authorLower != filters.authorLower){
		exact = false;
	  }

	  if(quote.authorClean.indexOf(filters.authorClean) <0 ){
		partial = false;
	  }
	}

	if(filters.search){
	  if(quote.quoteLower.indexOf(filters.searchLower) <0){
		exact = false;
	  }

	  if(quote.quoteClean.indexOf(filters.searchClean) <0 ){
		partial = false;
	  }
	}

	if(exact){
	  exactArr.push(quote);
	}
	if(partial){
	  partialArr.push(quote);
	}
  });
  console.log(`Found ${exactArr.length} Exact Matches and ${partialArr.length} for ${JSON.stringify(query)}`);
  if(exactArr.length > 0){
	return sample(exactArr);
  }
  if(partialArr.length > 0){
	return sample(partialArr);
  }
  return null;

}

function createFilters(query){
  let filters = {};
  if(query.author){
	filters.author = query.author;
	filters.authorLower = query.author.toLowerCase();
	filters.authorClean = stripStr(query.author);
  }

  if(query.search){
	filters.search = query.search;
	filters.searchLower = query.search.toLowerCase();
	filters.searchClean = stripStr(query.search);
  }
  return filters;
}

function getStats() {
  let authors = {}, tags = {};
  quotesSearchable.forEach(quote => {
	authors[quote.author] = authors[quote.author] ? (authors[quote.author]+1) : 1;
	tags[quote.tag] = tags[quote.tag] ? (tags[quote.tag]+1) : 1;
  });
  console.log(tags);
}

//console.log(getStats());

module.exports = {
  quotesArr,
  getRandom,
  getByQuery
}
