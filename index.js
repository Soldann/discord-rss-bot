//const Discord = require("discord.js"); //don't technically need this, will use webhooks
const RssFeed = require("rss-feed-emitter");
const axios = require("axios"); 


const feed = new RssFeed({ skipFirstLoad: true });
feed.add({
    url: "https://www.reddit.com/r/AskReddit/new/.rss"
});

async function sendMessage(message, timeout = 1000){
    axios.post(webhook, {
        content: message
    }).catch(function (err) {
        if (err.response){
            if (err.response.status == "429"){
                console.log("Ratelimiting, delaying sending the following message:" + message);
                setTimeout(sendMessage.bind(null,message,timeout*2),timeout); //exponential backoff
            }
        }
    });
}

feed.on('new-item', item => {
    sendMessage("*" + item.title + "*\n" + item.link);
});