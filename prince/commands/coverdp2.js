module.exports.config = {
  name: "coverdp2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "FAIZ ANSARI",
  description: "Dp cute",
  commandCategory: "Random-IMG",
  usages: "cover",
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
"https://i.imgur.com/0nqgeuP.jpg","https://i.imgur.com/HS6objA.jpg","https://i.imgur.com/hE4O4Gn.jpg","https://i.imgur.com/vB8cXcP.jpg","https://i.imgur.com/u1Yl2K4.jpg","https://i.imgur.com/dW3PiSZ.jpg","https://i.imgur.com/mpcxQKn.jpg","https://i.imgur.com/Zrsempv.jpg","https://i.imgur.com/KxLAgba.jpg","https://i.imgur.com/O6M6Bsb.jpg","https://i.imgur.com/HTsXsCn.jpg","https://i.imgur.com/3gxPUL8.jpg","https://i.imgur.com/mZh8Sqe.jpg","https://i.imgur.com/3BEd8Dm.jpg ",
     ];
     var callback = () => api.sendMessage({body:`💝 𝐌𝐚𝐝𝐞 𝐛𝐲 𝐌𝐑..𝐀𝐀𝐑𝐘𝐀𝐍🩷🪽 💝`,attachment: fs.createReadStream(__dirname + "/cache/1.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.jpg")).on("close",() => callback());
}