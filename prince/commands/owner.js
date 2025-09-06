module.exports.config = {
  name: "owner",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "Friends Dp photos",
  commandCategory: "Random-IMG",
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

  // Couple DP link
  var link = [
    "https://i.ibb.co/pByfrrmL/3e3c16c5f476a5acb45c8d849c0d8bf6-1.jpg"
  ];

  var callback = () => api.sendMessage({
    body: `🔰 𝑶𝑾𝑵𝑬𝑹 𝑰𝑵𝑭𝑶 🔰

𝐌𝐑.. 𝐃𝐄𝐕𝐈𝐋 𝐒𝐇𝐀𝐑𝐀𝐁𝐈 •◡•)

𝐀𝐠𝐞 : 27

𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐌𝐈𝐒𝐒 𝐒𝐇𝐀𝐋𝐔

𝐅𝐫𝐨𝐦 : 𝐑𝐀𝐉𝐀𝐒𝐓𝐇𝐀𝐍 (𝐔𝐃𝐀𝐈𝐏𝐔𝐑)

𝐒𝐭𝐮𝐝𝐲 : 𝐂𝐨𝐦𝐩𝐮𝐭𝐞𝐫 𝐏𝐫𝐨𝐠𝐫𝐚𝐦𝐦𝐢𝐧𝐠

𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 :  
https://www.facebook.com/share/19ffRVDrF4/

𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 :  
+919024870456

𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐆𝐫𝐨𝐮𝐩 :  
https://chat.whatsapp.com/JXr5wXNRpTy2883NqBXIsC

Jai Shree RaaM 🚩🌍❤️🙂!❤🙂♣️`,
    attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/1.jpg"))
    .on("close", () => callback());
};
