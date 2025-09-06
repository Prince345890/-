module.exports.config = {
  name: "owner",
  version: "1.0.1", // Updated version
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "Show bot owner information.", // Updated description
  commandCategory: "Info", // Updated category
  usages: "owner",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const path = require('path');
  const ownerProfilePath = path.join(__dirname, '..', 'ownerProfile.json');

  // Check if the ownerProfile.json file exists
  if (!fs.existsSync(ownerProfilePath)) {
    return api.sendMessage("Owner profile data not found. Please configure it using the dashboard.", event.threadID);
  }

  // Read the owner's profile data from the JSON file
  const ownerData = JSON.parse(fs.readFileSync(ownerProfilePath, 'utf-8'));

  // Couple DP link from ownerData
  var dpLink = ownerData.dpLink;
  
  // Construct the message body dynamically from the ownerData
  const messageBody = `
🔰 𝑶𝑾𝑵𝑬𝑹 𝑰𝑵𝑭𝑶 🔰

𝐌𝐑. ${ownerData.name}

𝐀𝐠𝐞: ${ownerData.age}

𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧: ${ownerData.relation}

𝐅𝐫𝐨𝐦: ${ownerData.from}

𝐒𝐭𝐮𝐝𝐲: ${ownerData.study}

𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤: ${ownerData.fbLink}

𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: ${ownerData.whatsappNo}

Jai Shree RaaM 🚩🌍❤️🙂!❤🙂♣️`;

  var callback = () => api.sendMessage({
    body: messageBody,
    attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));

  // Use the dynamic DP link from ownerData
  return request(encodeURI(dpLink))
    .pipe(fs.createWriteStream(__dirname + "/cache/1.jpg"))
    .on("close", () => callback());
};
