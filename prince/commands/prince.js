const fs = require("fs");
module.exports.config = {
	name: "Prince",
    version: "1.0.1",
	hasPermssion: 2,
	credits: "VanHung - Fixed by LTD", 
	description: "Auto reply when someone says Prince",
	commandCategory: "no prefix",
	usages: "🙂",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;

	if (event.body && (
        event.body.indexOf("PRINCE") == 0 || 
        event.body.indexOf("Prince") == 0 || 
        event.body.indexOf("prince") == 0 ||
        event.body.indexOf("ᴘʀɪɴᴄᴇ") == 0
    )) {
		var msg = {
			body: "हेलो बेबी मुझे MR DEVIL ने बनाया है। 🙂🌍🌸",
		};
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("🙂", event.messageID, (err) => {}, true);
	}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}
