const fs = require("fs");
module.exports.config = {
  name: "love you",
    version: "1.1.1",
  hasPermssion: 0,
  credits: "ABHISHEK", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handl

eEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("i love you") ||
     react.includes("love u") || react.includes("I LOVE YOU BOT") || react.includes("love you") ||
react.includes("Love you bot") ||
react.includes("love u bot")) {
    var msg = {
        body: `【 𝐈 𝐋0𝐕𝐄 𝐘0𝐔 𝐓0 𝐌𝐄𝐑𝐈 𝐉𝐀𝐍__😘😘 】`,
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🤩", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
