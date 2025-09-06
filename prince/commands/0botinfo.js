module.exports.config = {
	name: "bot",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "Arun Kumar", //don't change the credits please
	description: "Bot info.",
	commandCategory: "system",
	cooldowns: 1,
	dependencies: {
		"request":"",
		"fs-extra":"",
		"axios":""
	}
};

module.exports.run = async function({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) {
	const axios = global.nodemodule["axios"];
	const request = global.nodemodule["request"];
	const fs = global.nodemodule["fs-extra"];
	const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);

	const moment = require("moment-timezone");
	var juswa = moment.tz("Asia/Kolkata").format("『D/MM/YYYY』 【HH:mm:ss】");

	// 🔥 Tumhare diye hue image links
	var link = [
		"https://i.ibb.co/CK9PcGSs/a2696b1fe4fdf784075aa9e412f0dc9f.jpg",
		"https://i.ibb.co/4R4X3w9f/4bc07dd45df71a6fd34484eb32c32fde.jpg"
	];
	
	var callback = () => api.sendMessage({
		body: `===🦋⃝𝐃𝐞𝐯𝐢𝐥 𝐬𝐡𝐚𝐫𝐚𝐛𝐢'𝙎 𝘽𝙊𝙏===\n\n` +
			  `☄️𝘽𝙊𝙏𝙉𝘼𝙈𝙀☄️ »» ${global.config.BOTNAME}\n` +
			  `🌸𝙋𝙍𝙀𝙁𝙄𝙓🌸  »» ${global.config.PREFIX} ««\n\n` +
			  `🥳𝙐𝙋𝙏𝙄𝙈𝙀🥳\n\n` +
			  `𝑫𝑨𝑻𝑬 𝑨𝑵𝑫 𝑻𝑰𝑴𝑬 \n${juswa}\n\n` +
			  `⚡𝘽𝙊𝙏 𝙄𝙎 𝙍𝙐𝙉𝙉𝙄𝙉𝙂⚡ \n🕛${hours}:${minutes}:${seconds}🕧.`,
		attachment: fs.createReadStream(__dirname + "/cache/juswa1.jpg")
	}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa1.jpg"));

	return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
		.pipe(fs.createWriteStream(__dirname + "/cache/juswa1.jpg"))
		.on("close", () => callback());
};
