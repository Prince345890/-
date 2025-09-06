 const fs = require("fs");
module.exports.config = {
	name: "Aaryan",
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
	if(react.includes("owner") ||
     react.includes("@Əɱɱ'ʌ Dᴇᴠɪʟ Ȏʬ'ɭɭɘx") ||
     react.includes("devil") || 
react.includes("aryan")) {
		var msg = {
				body: "★𝗢𝘄𝗻𝗲𝗿 + 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗛𝗲𝗿𝗲★\n\n✦𝗠𝗥.𝗗𝗘𝗩𝗜𝗟 𝗞𝗜𝗡𝗚✦\n\n https://www.facebook.com/61560621821421 \n\n☞★★᭄𝗖𝗿𝗲𝗱𝗶𝘁'𝘀 :  𝐌𝐫..𝐃𝐞𝐯𝐢𝐥🩷🪽✦`🥀🦋",
				attachment: fs.createReadStream(__dirname + `https://i.imgur.com/5xEAkN2.jpeg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🦋", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

    }
