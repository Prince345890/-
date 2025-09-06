const fs = require("fs");
module.exports.config = {
  name: "khushi",
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
  if (event.body.indexOf("KHUSHI")==0 || event.body.indexOf("Khushi")==0 || event.body.indexOf("khushi")==0 || event.body.indexOf("@Khushi")==0) {
    var msg = {
        body: "❤️𝐘𝐄 𝐋𝐎 𝐊𝐇𝐔𝐒𝐇𝐈 𝐉𝐈 𝐀𝐀 𝐆𝐀𝐈🙈",
        attachment: fs.createReadStream(__dirname + `/cache/khusi.jpeg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🙆‍♀️Khushi", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }