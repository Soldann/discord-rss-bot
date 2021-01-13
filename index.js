//const Discord = require("discord.js"); //don't technically need this, will use webhooks
const RSS = require("rss-parser");
const axios = require("axios");
const Parser = require("rss-parser");


const requestInterval = 10000;

let parser = new Parser();
let lastUpdateTime = new Date();
console.log(lastUpdateTime);

async function sendMessage(message, timeout){
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

async function getFeed() {
    let feed = await parser.parseURL("https://www.reddit.com/r/AskReddit/new/.rss");
    console.log("_________________________________________________________");
    await Promise.all(feed.items.map(item => {
        console.log(item.title);
        let itemTime = new Date(item.pubDate);
        console.log("last update: " + lastUpdateTime);
        console.log("pub time: " + itemTime);
        if (lastUpdateTime < itemTime) {
            sendMessage("*" + item.title + "*\n" + item.link, 1000);
        }
    }));
    lastUpdateTime = new Date(); //update 
    console.log("Updated time: " + lastUpdateTime);
}

setInterval(getFeed,10000);