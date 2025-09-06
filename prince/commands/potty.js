const fs = require("fs");
module.exports.config = {
  name: "potty",
    version: "1.0.1",
  hasPermssion: 0,
  credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩", 
  description: "hihihihi",
  commandCategory: "no prefix",
  usages: "potty",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (event.body.indexOf("Potty")==0 || event.body.indexOf("potty")==0 || event.body.indexOf("tatti")==0 || event.body.indexOf("💩")==0) {
    var msg = {
        body: "💝 YE LO BBY POTTY 💩 KHAO 😄🤭😅",
        attachment: 
fs.createReadStream(__dirname + `/cache/Potty.jpeg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💩", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }