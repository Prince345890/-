module.exports.config = {
 name: "antiout",
 eventType: ["log:unsubscribe"],
 version: "0.0.1",
 credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
 description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
 let data = (await Threads.getData(event.threadID)).data || {};
 if (data.antiout == false) return;
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "self-separation" : "Koi Ase Pichware Mai Lath Marta Hai?";
 if (type == "self-separation") {
  api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
   if (error) {
    api.sendMessage(`${name} Ko Dubara Add Nhi Kar Paya 🥺 Group Mai :( `, event.threadID)
   } else api.sendMessage(`🍒🎀𝐌𝐞𝐫𝐞 𝐑𝐚𝐡𝐭𝐞 𝐇𝐮𝐲𝐞⛵𝐆𝐫𝐨𝐮𝐩 𝐒𝐞 𝐍𝐚𝐡𝐢 𝐉𝐚 𝐒𝐚𝐤𝐭𝐞😡💫 \n\n
  🖤 ${name} 🖤
  \n\n🌸 𝐀𝐝𝐦𝐢𝐧 😡 𝐢𝐬𝐞 𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥 𝐝𝐞𝐝𝐨 𝐦𝐚𝐢𝐧𝐞 𝐀𝐝𝐝 𝐤𝐫 𝐝𝐢𝐲𝐚..🙃😅`, event.threadID);
  })
 }
}
