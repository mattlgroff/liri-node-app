const keys = require('./keys.js')

const commands = ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"];

let argument1 = process.argv[2],
	argument2 = "";

if (process.argv[4] !== undefined){
	for (let i = 3; i < process.argv.length; i++){
	  argument2 += process.argv[i] + ' ';
	}	
}	
else {
	argument2 = process.argv[3];
}



processArguments();

function processArguments(){

	if (argument1 === "my-tweets"){
		console.log("Up to 20 Tweets About Javascript");
		console.log("");

		twitter("javascript");
	}
	else if(argument1 === "spotify-this-song"){

		if (argument2 === undefined){
			console.log("No song-title defined. Showing default result!");
			console.log("");
			spotify("The Sign by Ace of Base");
		}
		else {
			console.log("Searching for " + argument2);
			console.log("");
			spotify(argument2);
		}
	}
	else if(argument1 === "movie-this"){

		if (argument2 === undefined){
			console.log("No movie-title defined. Showing default result!");
			console.log("");
			omdb("Mr. Nobody.");
		}
		else {
			console.log("Searching for " + argument2);
			console.log("");
			omdb(argument2);
		}
	}
	else if(argument1 === "do-what-it-says"){
		readText();
	}
	else {
		console.log("I only understand the following commands: " + commands);
	}
}

function twitter(myTwitterHandle){

	const getBearerToken = require('get-twitter-bearer-token');

	const twitterConsumerKey = keys.TWITTER_CONSUMER_KEY;
	const twitterConsumerSecret = keys.TWITTER_CONSUMER_SECRET;

	getBearerToken(twitterConsumerKey, twitterConsumerSecret, (err, res) => {

	  if (err) {
	  	console.log("Error!");
	    //console.log(err);
	  } else {
	    let twitterBearerToken = res.body.access_token;

	    let query = myTwitterHandle;

	    runTwitterClient(twitterBearerToken, twitterConsumerKey, twitterConsumerSecret, query);

	  }
	})

}

function runTwitterClient(bearer, key, secret, query){

	const Twitter = require('twitter');

	let client = new Twitter({
	  consumer_key: key,
	  consumer_secret: secret,
	  bearer_token: bearer
	});

	client.get('search/tweets', {q: query, count: 20, result_type: "recent"}, function(error, tweets, response) {

		tweets.statuses.forEach(function(current_value, index) {
      let tweet = "@" + tweets.statuses[index].user.name + ": " + tweets.statuses[index].text;
      console.log(tweet);
      console.log("")
      console.log("Time Created: " + tweets.statuses[index].created_at);
      console.log("-----------" + (index + 1) );
    });
	  
	});

}

function spotify(title){
	let Spotify = require('node-spotify-api');
 
	let spotify = new Spotify({
	  id: keys.SPOTIFY_CLIENT_ID,
	  secret: keys.SPOTIFY_CLIENT_SECRET
	});
	 
	spotify.search({ type: 'track', query: title }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }

	  let searchResult = data.tracks.items[0];

		console.log("Artist: " + searchResult.artists[0].name); 
		console.log("Song Title: " + searchResult.name); 

		if (searchResult.preview_url === null){
			console.log("Preview URL: Not Found");
		}
		else {
			console.log("Preview URL: " + searchResult.preview_url);
		}
		
		console.log("Album Name: " + searchResult.album.name);

		});
}

function omdb(title){
	const request = require('request');

	const omdbApiKey = "40e9cece";

	let options = {
		method: 'get',
		url: "http://www.omdbapi.com/?apikey=" + omdbApiKey + "&t=" + title,
		json: true
	};

	request(options, function (error, response, body) {
		if (error !== null){
			console.log('error:', error);
		}
	  
	  if (response.statusCode !== 200){
	  	console.log('statusCode:', response && response.statusCode); 
	  }

	  // console.log('body:', body); 
	  console.log("Title: " + body.Title);
	  console.log("Release Year: " + body.Year);

	  if (body.Ratings[0] === undefined || body.Ratings[1] === undefined){
	  	console.log("Ratings: Not Found.");
	  }
	  else{
	  	console.log(body.Ratings[0].Source + " Rating: " + body.Ratings[0].Value);
	  	console.log(body.Ratings[1].Source + " Rating: " + body.Ratings[1].Value);
	  }
	
	  console.log("Country: " + body.Country);
	  console.log("Language: " + body.Language);
	  console.log("Plot: " + body.Plot);
	  console.log("Actors: " + body.Actors);

	});


}

function readText(){
	var fs = require('fs');

	fs.readFile("./random.txt", 'utf8', function(err, data) {
	  if (err) throw err;

	  let splitData = data.split(",");
	  argument1 = splitData[0];
	  argument2 = splitData[1];

	  processArguments();

	});

}