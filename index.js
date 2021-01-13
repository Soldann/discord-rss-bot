//const Discord = require("discord.js"); //don't technically need this, will use webhooks
const RSS = require("rss-parser");
const axios = require("axios");
const Parser = require("rss-parser");

const webhook = "WEBHOOK URL GOES HERE"

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
    let feed = await parser.parseURL("https://www.polygon.com/rss/nintendo/index.xml");
    let results = []
    feed.items.forEach(item => {
        console.log(item.title);
        let itemTime = new Date(item.pubDate);
        if (lastUpdateTime < itemTime) {
            results.push(sendMessage("*" + item.title + "*\n" + item.link, 1000));
        }
    });
    await Promise.all(results);
    lastUpdateTime = new Date(); //update 
    console.log("Updated time: " + lastUpdateTime);
}

setInterval(getFeed,10000);