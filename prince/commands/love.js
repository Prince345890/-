module.exports.config = {
    name: "love",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "AARYAN",
    description: "Get Pair From Mention",
    commandCategory: "img",
    usages: "[@mention]",
    cooldowns: 6,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async() => {
    // इस सेक्शन को खाली छोड़ दें क्योंकि अब हम इमेज डाउनलोड नहीं करेंगे
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    // बॉट के फोल्डर से सीधे इमेज लोड होगी
    let template = await jimp.read(__root + "/template.jpeg");
    let pathImg = __root + `/love_${one}_${two}.jpeg`;
    let avatarOne = __root + `/avt_${one}.jpeg`;
    let avatarTwo = __root + `/avt_${two}.jpeg`;

    let getAvatarOne = (await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    let getAvatarTwo = (await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    let avt1 = await jimp.read(avatarOne);
    let avt2 = await jimp.read(avatarTwo);

    avt1.resize(350, 350); 
    avt2.resize(350, 350); 
    
    template.composite(avt1, 90, 150);
    template.composite(avt2, 680, 650);

    let raw = await template.getBufferAsync("image/jpeg");
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

module.exports.run = async function ({ event, api, args }) {    
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
    else {
        const one = senderID, two = mention[0];
        return makeImage({ one, two }).then(path => api.sendMessage({ 
            body: "🌸===『*★𝗖𝗿𝗲𝗱𝗶𝘁'𝘀 𒁍𝐃𝐄𝐕𝐈𝐋☜ ✧•❁ 𝐋𝐎𝐕𝐄 ❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n       👑𝐘𝐄 𝐋𝐄 𝐌𝐈𝐋 𝐆𝐘𝐀 ❤\n\n𝐓𝐄𝐑𝐀 𝐏𝐘𝐀𝐑 🩷\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶                    ─━━◉❖𝐈 𝐋𝐎𝐕𝐄 𝐘𝐎𝐔🤗❖◉━━─           ❥═≛𝐒𝐎 𝐌𝐔𝐂𝐇 💝≛═❥                ─━━◉❖ 𝐌𝐘 𝐉𝐀𝐀𝐍𝐔 🙈❖◉━━─\nỖ𝐖ηᗴ𝐑◉❖𒁍𝐃𝐄𝐕𝐈𝐋", 
            attachment: fs.createReadStream(path) 
        }, threadID, () => fs.unlinkSync(path), messageID));
    }
}
