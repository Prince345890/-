const fs = require("fs");
module.exports.config = {
  name: "Priya",
    version: "1.0.1",
  hasPermssion: 0,
  credits: "FAIZ ANSARI", 
  description: "hihihihi",
  commandCategory: "no prefix",
  usages: "haniya",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (event.body.indexOf("@Сцтє Јдди")==0 || event.body.indexOf("Priyanshi")==0 || event.body.indexOf("priyanshi")==0 || event.body.indexOf("@Ряїүдиѕнї Мєняд")==0) {
    var msg = {
        body: "❤️𝐘𝐄 𝐋𝐎 𝐏𝐑𝐈𝐘𝐀𝐍𝐒𝐇𝐈 𝐉𝐈 𝐀𝐀 𝐆𝐀𝐈🙈",
        attachment: fs.createReadStream(__dirname + `/cache/priya.jpg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💚", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }