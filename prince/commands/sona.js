const fs = require("fs-extra");
const path = require('path');

module.exports.config = {
  name: "sona",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "FAIZ ANSARI & PREM BABU",
  description: "Dynamic GF Name Command",
  commandCategory: "No prefix",
  usages: "Sona",
  cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  const ownerProfilePath = path.join(global.client.mainPath, 'ownerProfile.json');
  if (!fs.existsSync(ownerProfilePath)) return;

  const ownerProfile = JSON.parse(fs.readFileSync(ownerProfilePath, 'utf-8'));
  const gfName = ownerProfile.gfName || "Sona"; // Default name if not set

  const triggerKeywords = [gfName.toLowerCase(), "sona", "meri gf"];
  const eventBody = event.body.toLowerCase();
  
  if (triggerKeywords.some(keyword => eventBody.includes(keyword))) {
    var msg = {
        body: `❤️𝐘𝐄 𝐋𝐎 ${gfName.toUpperCase()} 𝐉𝐈 𝐀 𝐆𝐀𝐈🙈`,
        attachment: fs.createReadStream(__dirname + `/cache/sona.jpg`)
      }
      api.sendMessage(msg, event.threadID, event.messageID);
      api.setMessageReaction("😇", event.messageID, (err) => {}, true);
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {
    // This command is handled by the handleEvent function, no run function needed.
  }
