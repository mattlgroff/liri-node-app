

const Twitter = require('twitter');
const getBearerToken = require('get-twitter-bearer-token');

const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;

getBearerToken(twitterConsumerKey, twitterConsumerSecret, (err, res) => {

  if (err) {
  	console.log("Error!");
    //console.log(err);
  } else {
    let twitterBearerToken = res.body.access_token;

    let query = process.argv[2];

    runTwitterClient(twitterBearerToken, twitterConsumerKey, twitterConsumerSecret, query);

  }
})

function runTwitterClient(bearer, key, secret, query){

	let client = new Twitter({
	  consumer_key: key,
	  consumer_secret: secret,
	  bearer_token: bearer
	});

	let tweetsObject = {
	};

	client.get('search/tweets', {q: query}, function(error, tweets, response) {
		tweets.statuses.forEach(function(current_value, index) {
      let tweet = "@" + tweets.statuses[index].user.name + ": " + tweets.statuses[index].text;
      tweetsObject[index] = tweet;
    });
	  
	});

}