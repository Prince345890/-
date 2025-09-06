module.exports.config = {
  name: "capal",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mrzues",
  description: "Random couple cover photos",
  commandCategory: "Random-IMG",
  usages: "Zues Collection",
  cooldowns: 2,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
    
};

module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
    var link = [
"https://i.postimg.cc/QCRM31PF/cb5f7033-ff48-4c9a-a4b5-9112dafe3fa2.jpg",
"https://i.postimg.cc/L5Zx5Fyx/Sharechat-dp-Sharechat-background-dp-beautiful.jpg",
"https://i.postimg.cc/vZWH91gs/4cb89d4a-2afe-4d76-bae4-c315c082db36.jpg",
"https://i.postimg.cc/Xq10SC2T/ce3ad2a3-b2ee-4971-8fb4-5badf14fb340.jpg",
"https://i.postimg.cc/c1Pvnt1D/d114bf79-308f-459c-8aff-9148755bd941.jpg",
"https://i.postimg.cc/SR9CMWBh/4af814bf-58d3-4584-8ae0-213543c4e480.jpg",
"https://i.postimg.cc/k5fWWMDT/eed00680-e3cb-41c3-a647-d78875d3ca5d.jpg"
     ];
     var callback = () => api.sendMessage({body:`💞➢𝐌𝐀𝐃𝐄 𝐁𝐘 𝐌𝐑.𝐀𝐀𝐑𝐘𝐀𝐍 𝐂𝐎𝐋𝐋𝐄𝐂𝐓𝐈𝐎𝐍 𝐎𝐅 𝐂𝐎𝐔𝐏𝐋𝐄 𝐅𝐁 𝐂𝐎𝐕𝐄𝐑 𝐏𝐈𝐂𝐓𝐔𝐑𝐄𝐒⚡︎⚡︎`,attachment: fs.createReadStream(__dirname + "/cache/1.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.jpg")).on("close",() => callback());
   };