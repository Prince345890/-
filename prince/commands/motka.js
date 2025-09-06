module.exports.config = {
  name: "motka",
  version: "7.3.2",
  hasPermssion: 0,
  credits: "John Lester + Modified by Sharabi",
  description: "Funny Auto Reply Bot",
  commandCategory: "no prefix",
  cooldowns: 5, 
};

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
  var { threadID, messageID } = event;
  var name = await Users.getNameUser(event.senderID);
  if (!event.body) return;

  let text = event.body.toLowerCase();

  // 🐶 Kutte wala response
  if (text.includes("kutta") || text.includes("kute") || text.includes("kutte") || text.includes("kuta")) { 
    api.sendMessage({ body: `😝 ${name}, तुम होगी कुत्ती! मै तो बोट हूँ 🥂👈` }, threadID, messageID);
    api.setMessageReaction("🐶", event.messageID, () => {}, true);
  }

  // 🫏 Gadha wala response
  else if (text.includes("gadha") || text.includes("gadhha") || text.includes("gadhe")) { 
    api.sendMessage({ body: `😂 ${name}, गधा तुम खुद हो! मै तो smart बोट हूँ 🤖🔥` }, threadID, messageID);
    api.setMessageReaction("🫏", event.messageID, () => {}, true);
  }

  // 🤪 Pagal wala response
  else if (text.includes("pagal") || text.includes("paagal")) { 
    api.sendMessage({ body: `🤪 ${name}, पागल तुम! 😝 मैं तो दुनिया का सबसे समझदार बोट हूँ 🚀` }, threadID, messageID);
    api.setMessageReaction("🤯", event.messageID, () => {}, true);
  }

  // 😡 Teri esi ki tesi wala response
  else if (text.includes("teri esi ki tesi") || text.includes("teri aisi ki taisi")) { 
    api.sendMessage({ body: `😡 अबे ${name}, तेरी ऐसी तैसी कौन करेगा रे? बोट से पंगा मत ले 🤖🔥` }, threadID, messageID);
    api.setMessageReaction("💢", event.messageID, () => {}, true);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) { }
