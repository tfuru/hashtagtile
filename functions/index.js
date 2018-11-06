const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const axios = require('axios');
const cheerio = require('cheerio');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.tweet = functions.https.onRequest((req, resp) => {
    const tweet = req.body;
    const hashtag = req.query.hashtag;

    console.log("tweet",tweet);
    console.log("hashtag",hashtag);
    console.log("LinkToTweet",tweet.LinkToTweet);
    axios.get(tweet.LinkToTweet).then(function(response){
        // handle success
        const $ = cheerio.load(response.data);
        const content = $("meta[property='og:image']").attr('content');
        console.log("content",content);
        tweet.ImageUrl = content;
        admin.database().ref('/tweets/'+hashtag).push(tweet)
            .then((snapshot) => {
                return;
            })
            .catch(function(error) {
                console.log('ERROR!!');
            });
        return;
    })
    .catch(function(error) {
        console.log('ERROR!!');
    });
    return resp.status(200).send("{\"status\":\"OK\"}");
});
