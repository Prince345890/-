const fs = require("fs");
module.exports.config = {
	name: "sweety",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by LTD", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "sub",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("SWEETY")==0 || event.body.indexOf("sweety")==0 || event.body.indexOf("Sweety")==0 || event.body.indexOf("@Sweety Thakur")==0) {
		var msg = {
				body: "😍𝐘𝐄 𝐋𝐎 𝐒𝐖𝐄𝐄𝐓𝐘 𝐓𝐇𝐀𝐊𝐔𝐑 𝐀𝐀 𝐆𝐘𝐈😍  ",
				attachment: fs.createReadStream(__dirname + `/noprefix/sweety.jpeg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🤭", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
