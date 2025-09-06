const fs = require("fs");
module.exports.config = {
  name: "soni",
    version: "1.0.1",
  hasPermssion: 0,
  credits: "Aaryan", 
  description: "no prefix",
  commandCategory: "No command marks needed",
  usages: "...",
    cooldowns: 100, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("Meri setting") ||
     react.includes("Soni") ||
     react.includes("soni") || 
react.includes("@Tera Bf Mera Deewana")) {
    var msg = {
        body: "𝐘𝐄 𝐋𝐎 𝐒𝐎𝐍𝐈 𝐁𝐀𝐁𝐘🍒 𝐀𝐀 𝐆𝐘𝐈🌿",
        attachment: fs.createReadStream(__dirname + `/cache/soni.jpg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🍒", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }