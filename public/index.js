class App {

    constructor(){
        console.log("constructor");
        try {
            this.firebaseApp = firebase.app();
            //let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof this.firebaseApp[feature] === 'function');
            this.database = this.firebaseApp.database();
        } catch (e) {
            console.error(e);
        }

        this.vueApp = new Vue({
            el: '#columns',
            data: {
                tweets:[]
            }
        });
    };

    onLoaded(){
        //URLにつけたハッシュ・タグを取得する
        let hashtag = location.hash.replace("#","").trim();
        console.log("onLoaded",hashtag);

        //DB更新 イベントの読み取り
        let fnc =  this.onChildAdded.bind(this);
        this.database.ref('/tweets/'+hashtag).on('child_added', fnc);
    };

    onChildAdded(snapshot){
        console.log("onChildAdded",snapshot.key,snapshot.val());
        //console.log("this.vueApp",this.vueApp);
        var tweet = snapshot.val();
        //TODO RTの場合処理しない
        
        if(typeof(tweet.ImageUrl) == "undefined"){
            tweet.ImageUrl = "150x150.png";
        }

        //IFTTTのエスケープを外す
        tweet.UserName = tweet.UserName.replace("<<","").replace(">>","");
        tweet.Text = tweet.Text.replace("<<","").replace(">>","");

        this.vueApp.tweets.push(tweet);
        /*
        CreatedAt
        Text
        UserImageUrl
        UserName
        */
    };
};

let app = new App();
document.addEventListener('DOMContentLoaded', function() {
    app.onLoaded();
});
