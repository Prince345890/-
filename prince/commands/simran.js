const fs = require("fs");
module.exports.config = {
	name: "mahira",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by Ishika", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "reena",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("mahira")==0 || event.body.indexOf("@Mahira")==0 || event.body.indexOf("MAHIRA")==0 || event.body.indexOf("Mahira")==0) {
		var msg = {
				body: "😍𝐘𝐄 𝐋𝐎 𝐌𝐀𝐇𝐈𝐑𝐀 𝐀𝐍𝐒𝐀𝐑𝐈 𝐀𝐀 𝐆𝐘𝐈😍",
				attachment: fs.createReadStream(__dirname + `/cache/mahira.jpeg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💎", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
