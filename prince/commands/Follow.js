const fs = require("fs");
module.exports.config = {
	name: "follow",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "Aaryan", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "follow",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Mr Aaryan")==0 || event.body.indexOf("follow")==0 || event.body.indexOf("request")==0 || event.body.indexOf("aaryan baby")==0) {
		var msg = {
				body: "👋For Any Kind Of Help Contact On Instagram Username 👉 @aaryan_maurya_99😇",
				attachment: fs.createReadStream(__dirname + `/noprefix/sub.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🔔", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
