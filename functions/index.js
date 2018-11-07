const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const axios = require('axios');
const cheerio = require('cheerio');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.tweet = functions.https.onRequest((req, resp) => {
    const hashtag = req.query.hashtag;
    const content_type = req.headers["content-type"];
    console.log("content_type",content_type);
    let tweet = req.body;
    //console.log("tweet 1",tweet);
    if(content_type === "text/plain"){
        tweet = JSON.parse(tweet.replace(/\r?\n/g,""));
    }
    //console.log("tweet 2",tweet);

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
