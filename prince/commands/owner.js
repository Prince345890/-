const fs = require('fs-extra');
const request = require('request');
const path = require('path');

module.exports.config = {
  name: "owner",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "Show bot owner info with a dynamic profile picture.",
  commandCategory: "utility",
  usages: "owner",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const ownerProfilePath = path.join(global.client.mainPath, 'ownerProfile.json');
  
  if (!fs.existsSync(ownerProfilePath)) {
    return api.sendMessage("Owner profile data not found. Please update it via the dashboard.", event.threadID);
  }

  const ownerProfile = JSON.parse(fs.readFileSync(ownerProfilePath, 'utf-8'));
  
  const { name, age, relation, from, study, fbLink, whatsappNo, dpLink } = ownerProfile;

  // Use the dynamic DP link from ownerProfile.json
  var link = [dpLink];

  var callback = () => api.sendMessage({
    body: `🔰 𝑶𝑾𝑵𝑬𝑹 𝑰𝑵𝑭𝑶 🔰

𝐌𝐑.. ${name}

𝐀𝐠𝐞 : ${age}

𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : ${relation}

𝐅𝐫𝐨𝐦 : ${from}

𝐒tudy : ${study}

𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 :
${fbLink}

𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 :
${whatsappNo}

Jai Shree RaaM 🚩🌍❤️🙂!❤🙂♣️`,
    attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));

  return request(encodeURI(link[0]))
    .pipe(fs.createWriteStream(__dirname + "/cache/1.jpg"))
    .on("close", () => callback());
};
