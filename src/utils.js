const emoji = require('node-emoji');
const E = e => emoji.emojify(e);

// Utils
exports.E = E;


exports.stripStr = (phrase) =>{
  return phrase.trim().replace(/[\?'.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
}

exports.sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}
