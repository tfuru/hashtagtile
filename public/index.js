class App {

    constructor(){
        console.log("constructor");
        try {
            this.firebaseApp = firebase.app();
            this.database = this.firebaseApp.database();
        } catch (e) {
            console.error(e);
        }
    };

    onLoaded(){
        this.vueApp = new Vue({
            el: '#app',
            data: {
                hashtag:"",
                tweets:[],
                isModalInfo: false,
                isDonation: false,
                bodyJsonSample:'{"UserName":"<<<{{UserName}}>>>","CreatedAt":"{{CreatedAt}}","UserImageUrl":"{{UserImageUrl}}","FirstLinkUrl":"{{FirstLinkUrl}}","LinkToTweet":"{{LinkToTweet}}"}'
            },
            methods: {
                openItem() {
                    console.log("openItem");
                    this.toggleIsModalInfo();
                },
                toggleIsModalInfo() {
                    this.isModalInfo = !this.isModalInfo;
                },
                openDonation(){
                    console.log("openDonation");
                    this.toggleIsDonation();
                },
                toggleIsDonation() {
                    this.isDonation = !this.isDonation;
                },
            }
        });

        //URLにつけたハッシュ・タグを取得する
        this.vueApp.hashtag = location.hash.replace("#","").trim();

        //タイトル書き換え
        document.title += " #"+this.vueApp.hashtag;
        document.querySelector("meta[property='og:title']").setAttribute('content', document.title);
        
        var limitToLast = 200;
        console.log("onLoaded",this.vueApp.hashtag);

        //DB更新 イベントの読み取り
        let fnc =  this.onChildAdded.bind(this);
        this.database.ref('/tweets/'+this.vueApp.hashtag).limitToLast(limitToLast).on('child_added', fnc);
    };

    onChildAdded(snapshot){
        console.log("onChildAdded",snapshot.key,snapshot.val());
        var tweet = snapshot.val();

        if(typeof(tweet.ImageUrl) == "undefined"){
            tweet.ImageUrl = "img/150x150.png";
        }

        this.vueApp.tweets.push(tweet);
    };
};

let app = new App();
document.addEventListener('DOMContentLoaded', function() {
    app.onLoaded();
});
