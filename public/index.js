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
                bosySample:'{"UserName":"<<<{{UserName}}>>>","CreatedAt":"{{CreatedAt}}","UserImageUrl":"{{UserImageUrl}}","FirstLinkUrl":"{{FirstLinkUrl}}","LinkToTweet":"{{LinkToTweet}}"}'
            },
            methods: {
                openItem() {
                    console.log("openItem");
                    this.toggleModal();
                },
                toggleModal() {
                    this.isModalInfo = !this.isModalInfo;
                }
            }
        });

        //URLにつけたハッシュ・タグを取得する
        this.vueApp.hashtag = location.hash.replace("#","").trim();
        console.log("onLoaded",this.vueApp.hashtag);

        //DB更新 イベントの読み取り
        let fnc =  this.onChildAdded.bind(this);
        this.database.ref('/tweets/'+this.vueApp.hashtag).limitToLast(100).on('child_added', fnc);
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
