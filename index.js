const RssFeed = require("rss-feed-emitter");
const axios = require("axios"); 

const webhook = "INSERT WEBHOOK URL HERE"

const feed = new RssFeed({ skipFirstLoad: true });
feed.add({
    url: "https://www.polygon.com/rss/nintendo/index.xml"
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
    sendMessage("**" + item.title + "**\n" + item.link);
});