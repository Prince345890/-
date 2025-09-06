module.exports.config = {
  name: "boydp",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "DEVIL SHARABI",
  description: "Send random boy DP photo with yes/no confirm (safe upload & retry)",
  commandCategory: "Random-IMG",
  usages: "boydp",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const prompt = "Abe Yaar Pura Command To Likh Le 😹 ckbot Yes Or Not ? (reply: yes / no)";
  const commandName = module.exports.config.name;

  api.sendMessage(prompt, event.threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: commandName,
      messageID: info.messageID,
      author: event.senderID,
      type: "confirm"
    });
  }, event.messageID);
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  if (handleReply.type !== "confirm" || event.senderID !== handleReply.author) return;

  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { join } = require("path");

  const msg = (event.body || "").trim().toLowerCase();
  if (msg !== "yes" && msg !== "no") return;

  if (msg === "no") {
    return api.sendMessage("Thik hai, cancel kar diya 😏", event.threadID, () => {}, handleReply.messageID);
  }

  // YES: download & send image
  // Yahan naye links daale gaye hain
  const links = [
    "https://i.ibb.co/QFC0RYg6/bc7d8b724f2e969e5e5d26d14f39c0c4.jpg",
    "https://i.ibb.co/PZjDqgkF/e3b89164d34a16ee2462816898a267a2.jpg",
    "https://i.ibb.co/tMsBxDZj/de9931a1a977594ebd426db5f78b44e6.jpg",
    "https://i.ibb.co/gZjKPpcM/2a228525c8f346e69454c3dab0e885d0.jpg",
    "https://i.ibb.co/3Y7xB0GN/f7b179a72f864f1627844709e1fe6d8b.jpg",
    "https://i.ibb.co/7dZhwFbV/df719759b0e50c8c3bfa77356c9e9a46.jpg",
    "https://i.ibb.co/bRCHgPrV/29bbbabb4a7325b2ae0113c7b7cbe664.jpg",
    "https://i.ibb.co/4wMMXDdX/16d049ec548544d19eed63a7df7e4883.jpg",
    "https://i.ibb.co/4gW24tm7/34ba339978094dcd5a843d159763a368.jpg",
    "https://i.ibb.co/b5Ttxrqd/6677747b99a56176282e326398ada99c.jpg",
    "https://i.ibb.co/Pzh84hST/ce6e32d1f29fa00b3a386331eb26bf1a.jpg",
    "https://i.ibb.co/MyKJGJB3/3e3bf89a2d96a66165b97385da9135ae.jpg",
    "https://i.ibb.co/cKxthC78/4fae6f948b7e6c3a3be554b8d16f9786.jpg",
    "https://i.ibb.co/DD5gx4Dv/3cb3d746bb2418459fcabf01d9aaab6f.jpg",
    "https://i.ibb.co/v4SDdnW5/01c3aa77a7810ed3ec9596974b64cf4f.jpg",
    "https://i.ibb.co/LKKfSH3/d70ec815634d267c04334444047ad762.jpg",
    "https://i.ibb.co/0yG5PKwb/3eedc03e14f69e0f60ed7b0368caa9c9.jpg",
    "https://i.ibb.co/bM9GDWd6/abe0dc3f67c5067acf86340f3cf69ed8.jpg",
    "https://i.ibb.co/YTdZNjxJ/538e8fd5502d20f16f2d8251470aa2cf.jpg",
    "https://i.ibb.co/84d9MMmh/21fb7228311151660744b429d9a7af8d.jpg",
    "https://i.ibb.co/XQ51swH/be6235d298ffee23cf9e3a5e7f53562c.jpg",
    "https://i.ibb.co/LDQSbndw/3080aa2c24a92c4cab64751b2cc19cf9.jpg",
    "https://i.ibb.co/V0LgW2Z5/42fc52ab4fee041b2122e1063c24ff47.jpg",
    "https://i.ibb.co/ZZyP1KF/dc9a77a2bb8bcc3e98a45a44baad7539.jpg",
    "https://i.ibb.co/cc0RLpfZ/2db2b5351d32b8a17457d0107675a6bf.jpg",
    "https://i.ibb.co/zhFPgcDg/7a149d7903360e74e7bd21293a362a15.jpg",
    "https://i.ibb.co/dwjD7z2L/a2e07af911f5ac0164816018b014a597.jpg",
    "https://i.ibb.co/3y8kLCM5/2db9421190939927d8cdc6dbfbe8d317.jpg",
    "https://i.ibb.co/VpPhV5TX/35a242b314413e35f77209ce3bd2c374.jpg",
    "https://i.ibb.co/Jw2DBrZF/cb588cb02400c8efa6eee0fdb90a3e90.jpg",
    "https://i.ibb.co/h1y1LLRz/bc9457cfbfb2178158b60b557b7bb6f9.jpg",
    "https://i.ibb.co/V08y2tML/e1db8be1ad35df23e0bf249f4a0b6a68.jpg",
    "https://i.ibb.co/kLBNNN4/9c8f92e43459e1055f11e6b89669faf9.jpg",
    "https://i.ibb.co/XxJXYWkg/3e14cf4ed3beee32ff0fc063cb39cc10.jpg",
    "https://i.ibb.co/zTBpJQVC/9c1d63488a60cb47b233daa2220d19ca.jpg",
    "https://i.ibb.co/rfvNCt3z/44a51844fd7f8e487acf590d0a576ffc.jpg",
    "https://i.ibb.co/RpsyWS1q/8448716d5f75cd18942fed528a741eea.jpg",
    "https://i.ibb.co/4ZQnJ4bz/a628874a305b7a5af931aceaca443614.jpg",
    "https://i.ibb.co/Hf3vPyZP/aadb18c3834a5abdb315a0c41ea76108.jpg",
    "https://i.ibb.co/Css4yfkZ/4f24f00dee95f46a42e8959083c8bb55.jpg",
    "https://i.ibb.co/Q7KBPS7w/5eb2ac9d6e9475c2f6b9a7f67a812a0e.jpg",
    "https://i.ibb.co/N6DYMbN1/fcb2c8d684dd6ac0604874996510e103.jpg",
    "https://i.ibb.co/PZSg97Y5/f7345726bc9a088ca61fd17bd8c98dcb.jpg",
    "https://i.ibb.co/sdywYwpV/64b541b9039d81b98361f1d315c50833.jpg",
    "https://i.ibb.co/QFmr9Stv/890a7d92be35919bfdd6435f39f4582b.jpg",
    "https://i.ibb.co/pv1X8PwX/52749a98698073b130592b9c34138976.jpg",
    "https://i.ibb.co/7Jp4BhdB/0a63d1b481d4008ca2d267c152b4ed11.jpg",
    "https://i.ibb.co/gLK7dGDP/db20ade5a10eb05f0b57d86fe0f1b736.jpg",
    "https://i.ibb.co/n8K4sp6Q/1a23246c5693a3930d564b6e3598d597.jpg",
    "https://i.ibb.co/YVSTsCm/046e1362f82c338f35db94ea509db120.jpg",
    "https://i.ibb.co/xQ9QKnv/3668806f164f49e3cc9e86cf149a6be8.jpg",
    "https://i.ibb.co/RGrvCxSZ/511a7191161b687b89ca10be9be65d3f.jpg",
    "https://i.ibb.co/GQvQhCT9/7d8b225c78448aa06e34ddee04b5368c.jpg",
    "https://i.ibb.co/b5SZ82DV/e33ff40d0550719ce47e637761918635.jpg",
    "https://i.ibb.co/jvm0NQwR/ab9e021ac695fe63626e4df75aa8fd3c.jpg",
    "https://i.ibb.co/msg397Q/fcc053d29c10338b70da7b348cdcaf20.jpg",
    "https://i.ibb.co/svYw10YL/f2f88a6f8f494507c79696ed43c9d069.jpg",
    "https://i.ibb.co/Pv74tbt2/180566a5de52cce735a9fbd04a50ff4a.jpg",
    "https://i.ibb.co/B2VPSB4F/90a24eab4d243cad154f9a032dda2e7b.jpg",
    "https://i.ibb.co/35Spw1gD/f44241682eee62423c634d9ed2a62ccf.jpg",
    "https://i.ibb.co/1tLCN0Zq/5210878181c1f61f22e80875f7d4cb1f.jpg",
    "https://i.ibb.co/Kc6TkRHg/3439b19e89b417d5ecf253614e1cfeb9.jpg",
    "https://i.ibb.co/fP5TwZF/9723ad31b06b1554582e348a5eb8f37e.jpg",
    "https://i.ibb.co/gNQmbqx/cfd23a2623a7f85c9bb502158d6923bb.jpg",
    "https://i.ibb.co/21jdQHMH/8c935d2cb3ec18c452707c524e144b76.jpg",
    "https://i.ibb.co/twmGQnC4/c3ace06208de6d17c8a89a13a547d58c.jpg",
    "https://i.ibb.co/cXYBNpBW/ebb63deefb8fd3121096547f97fe3279.jpg",
    "https://i.ibb.co/SwNqSZfB/ad02532d0b2c857e24f637c63f5d8e29.jpg",
    "https://i.ibb.co/svpZsXF0/e4fde11e3198b29880dd1b690c078228.jpg",
    "https://i.ibb.co/0jCY7X6h/cee2c469c5ae638015ed1429f76766db.jpg",
    "https://i.ibb.co/5WG9NQ4G/158cfd34f807c505ec3964f2a4c83541.jpg",
    "https://i.ibb.co/1fjbwyF7/8078739e0ea31b26652d9f9c2559e8fe.jpg",
    "https://i.ibb.co/SDx6V0Xn/67edd4208c6e2b2300a8e20e9500790e.jpg",
    "https://i.ibb.co/7NBWHNqp/93a7f6ea54c52d5ac5a358220b5ea3d9.jpg",
    "https://i.ibb.co/Y4qszMT5/a2b8b1d74b3dc88efc1269c76619420a.jpg",
    "https://i.ibb.co/nq05BcW9/c930ce3498703940f0f076b01c0c4f85.jpg",
    "https://i.ibb.co/KczzNhDp/bd0477dc334c1f1382b1c6531810a59f.jpg",
    "https://i.ibb.co/xKWvJ0T5/cfc01aa0cc2285b519a923f140cd874e.jpg",
    "https://i.ibb.co/nqXJ4C1x/048316e61a930a9f1283c7567580dbf9.jpg",
    "https://i.ibb.co/WvYr2kkT/593bfc85ab03f123a1d8d6da12bf9aed.jpg",
    "https://i.ibb.co/sp4bXnDN/42ad524a3f1173680604d0fcdfb9dca6.jpg",
    "https://i.ibb.co/BKzLVN7Y/7bce3ddb547cd6511d0e453df2b258f8.jpg",
    "https://i.ibb.co/HDwsLJ0S/424b5ac90ed38d08704cfaf0bde6b6f9.jpg",
    "https://i.ibb.co/gFh308qD/a52dba051e36a71982e8ec1ba12faeff.jpg",
    "https://i.ibb.co/60bqRtHy/1f933dda934ee928079428351e768560.jpg",
    "https://i.ibb.co/fdQHNXTH/b1d8b02c9ee3a2eca0f12757e63564ee.jpg",
    "https://i.ibb.co/NPV68q3/b3835529d467d25a452bd8159601cea6.jpg",
    "https://i.ibb.co/pjxt0gcn/fda1ea49bf195a7b7adff14b9f9249c2.jpg",
    "https://i.ibb.co/DHrFnDxW/b3bfe10aea39c945d875c2fafb3b0655.jpg",
    "https://i.ibb.co/39gn2zs9/97dd4e510bc60f8bc139ff5a86642a71.jpg",
    "https://i.ibb.co/GvbrwJ9n/2e92396ac149b8eea4e1b0428abcab0c.jpg",
    "https://i.ibb.co/j2f71B0/517ab41dc70653b6ea9124aa49026de1.jpg",
    "https://i.ibb.co/GQR5NS6v/690a2c64b0139c6867fe521b7ca34b89.jpg",
    "https://i.ibb.co/7J12DrM6/fbf0dc482805cbfef1659dc4ae9c2eac.jpg",
    "https://i.ibb.co/F26s2Mj/7b58d1f9bae02088a34e682e1e5e0793.jpg",
    "https://i.ibb.co/xKL0XCYv/e2da748a9e8561084d0a85de8e83439a.jpg",
    "https://i.ibb.co/zWsDD89T/8b24a3f775afd201d89167d7ce6d4e19.jpg",
    "https://i.ibb.co/rKGqJLvr/b2a80d06ee2525f6ac3a59e35e983f9d.jpg",
    "https://i.ibb.co/27ysr9Dp/c011f232331080821525ad044bd72749.jpg",
    "https://i.ibb.co/wh0rgKWw/c0c926e68b7dd1cff42a005fa3e34cf6.jpg",
    "https://i.ibb.co/G40wJGqz/d274b06e0585f8d57f52bf5f2dceddc6.jpg",
    "https://i.ibb.co/FqgG9SW5/76075d4ff28e22cacc6bba7e20d83157.jpg",
    "https://i.ibb.co/ZRs50nrF/582055aff8e9a4b17b8fc9cc145547e5.jpg",
    "https://i.ibb.co/FqNQqrvB/0af15ff1a8673553f146a619efe396ac.jpg",
    "https://i.ibb.co/9HwLKjVZ/f6d9f359f85151dba42b35f60b910739.jpg",
    "https://i.ibb.co/Xr2zxLL4/b3802a120a33ab2e217463b905f0cf62.jpg",
    "https://i.ibb.co/cWqZpWf/a30bc7ed0954ae98ebf3b1e961bfe2bd.jpg",
    "https://i.ibb.co/qFF1jfgK/fb7b094a7c820a68e60b37a7da7fac0f.jpg",
    "https://i.ibb.co/TDkkCqh6/4e8c4c99f70c6b58d3fec7ee49a9dce6.jpg",
    "https://i.ibb.co/nqH8sn5B/45253ac05fa2b864a2fad8d1408ba830.jpg",
    "https://i.ibb.co/rGkc66wm/d12f138417e69b9f6779a27974d250cb.jpg",
    "https://i.ibb.co/pjgpYB7S/0f39b006aa7dab601f122d1520db3ff5.jpg",
    "https://i.ibb.co/wrysRQ1k/342ee567523147c5b92bc962ab92efc4.jpg",
    "https://i.ibb.co/R40FdNDM/a263bc5b63812a67fbe9d1eb0b5fb6f5.jpg",
    "https://i.ibb.co/Q33G4SR7/520bd8e715051dac90b818a6fb593fa6.jpg",
    "https://i.ibb.co/zVNS75zg/20d33986ad508394724a30695cbff7ea.jpg",
    "https://i.ibb.co/rGdbMM2N/a8f034ce39e0d6c44cb072c570e49471.jpg",
    "https://i.ibb.co/HTj9XMNW/e504cd33ecd4688a800b5f953506bc37.jpg",
    "https://i.ibb.co/4RkVDp6P/63df77b721014c14a6f7d8cb06196668.jpg",
    "https://i.ibb.co/5hwRpBH6/511ef4510efb150690bd508d1f7c3269.jpg",
    "https://i.ibb.co/jkYmsxtr/85556638625d3bac0e371510c40f080e.jpg",
    "https://i.ibb.co/XxzJfBg7/0218e06561586cf745ce1f2564ba7d0f.jpg",
    "https://i.ibb.co/hx6H3Bk3/e1d07ab1e8ac993559b987c1bcfc0be5.jpg",
    "https://i.ibb.co/7xyjvgg5/7768ba4a5fb9290067e3d6a7f7c32856.jpg",
    "https://i.ibb.co/GvFFQPzJ/a31f017b0560c089583eeca7d237aaad.jpg",
    "https://i.ibb.co/F4yrq4Xt/761ff00b96e2e91b9d70e2d33516bed7.jpg",
    "https://i.ibb.co/ynXHJ1GP/48c22aa475c993cfe1af2d278879beac.jpg",
    "https://i.ibb.co/tM9JVSqL/780032a72a385a39c24c61b252d9225c.jpg",
    "https://i.ibb.co/FkjB2fBD/3094a5b30406408bf30b50d419ab5ad3.jpg",
    "https://i.ibb.co/hJs19wsv/d6b36adbcd3ee3ccdda05e37fb2c957e.jpg",
    "https://i.ibb.co/nVwp7Bx/d66d3f1a36e6ec5b749055322ae6614a.jpg"
  ];

  const cacheDir = join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const filePath = join(cacheDir, `boydp_${Date.now()}.jpg`);
  const randomLink = links[Math.floor(Math.random() * links.length)];

  const sendWithRetry = async (attempt = 1) => {
    if (attempt > 3) {
      return api.sendMessage(`Arey, image download nahi ho pa rahi hai. Yeh lo link: ${randomLink}`, event.threadID, () => {}, handleReply.messageID);
    }

    try {
      const response = await axios({
        method: "GET",
        url: encodeURI(randomLink),
        responseType: "stream",
        timeout: 30000
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", (err) => {
          console.error("File write error:", err);
          reject(err);
        });
      });

      const stat = fs.statSync(filePath);
      if (!stat || stat.size <= 0) {
        throw new Error("Empty file or file not found.");
      }

      api.sendMessage({ 
          body: "💝 𝐌𝐚𝐝𝐞 𝐛𝐲 𝐃𝐞𝐯𝐢𝐥 𝐬𝐡𝐚𝐫𝐚𝐛𝐢 💖", 
          attachment: fs.createReadStream(filePath) 
      }, event.threadID, (err) => {
          fs.unlinkSync(filePath);
          if (err) {
            console.error("Facebook API send error:", err);
            return sendWithRetry(attempt + 1);
          }
      }, handleReply.messageID);

    } catch (e) {
      console.error("Image download/processing error:", e.message);
      fs.unlink(filePath, () => {});
      return sendWithRetry(attempt + 1);
    }
  };

  sendWithRetry();
};
