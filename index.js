//const Discord = require("discord.js"); //don't technically need this, will use webhooks
const RSS = require("rss-parser");
const axios = require("axios");
const Parser = require("rss-parser");

let parser = new Parser();
let time = new Date();
console.log(time);

async function getFeed() {
    let feed = await parser.parseURL("https://www.polygon.com/rss/nintendo/index.xml");
    feed.items.forEach(item => {
        console.log(item.title);
        let itemTime = new Date(item.pubDate);
        console.log(itemTime < time);
    });
}

setInterval(getFeed,10000);