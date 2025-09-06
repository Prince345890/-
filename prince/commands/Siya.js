const fs = require("fs");
module.exports.config = {
	name: "kashish",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "FAIZ ANSARI", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "naina",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("kashish")==0 || event.body.indexOf("@Kashish Khan")==0 || event.body.indexOf("Kashish")==0 || event.body.indexOf("KASHISH")==0) {
		var msg = {
				body: "❤️𝐘𝐄 𝐋𝐎 𝐊𝐀𝐒𝐇𝐈𝐒𝐇 𝐉𝐈 𝐀 𝐆𝐀𝐈🙈",
				attachment: fs.createReadStream(__dirname + `/cache/kashish.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😇", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
