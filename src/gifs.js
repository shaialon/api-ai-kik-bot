const {sample} = require('./utils');

const gifs = {
  robot_fail: [
	`https://media.giphy.com/media/N8wR1WZobKXaE/giphy.gif`,
	`https://media.giphy.com/media/3o85xwc5c8DCoAF440/giphy.gif`,
	`https://media.giphy.com/media/v7QyD3p5TvDfG/giphy.gif`,
	`https://media.giphy.com/media/4d51HHDLd8BPy/giphy.gif`,
	`https://media.giphy.com/media/dKs4NntOpkFRm/giphy.gif`
  ]
}


exports.getGif = subject => {
  if(gifs[subject]){
	return sample(gifs[subject]);
  }
  return null;
}
