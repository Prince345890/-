module.exports.config = {
  name: "goiadmin",
  version: "1.0.0-beta-fixbyDungUwU",
  hasPermssion: 0,
  credits: "ZyrosGenZ-fixbyDungUwU",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100027055397691") {
    var aid = ["100027055397691"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["Abee Mere se baat Kar ..Aaryan Boss Ko mention kyu kar rhe ho😒" , "Kya Hua Aaryan Boss ko q Bula Rhe Ho?" , "Wo Shayad Busy h😐🙄" , "Tujhe sunai nhi deta mere admin ko tang na kr😒😒" , "Mere Aaryan boss ko tang naa karo" , "Abee Bola na mere Admin ko bar bar mention mat karo ek bar me smjh nahi ata" , "Kya kaam hai mujhe bol" , "Ek Baar me samjh ni ata kyu mention kar rhe ho Aaryan Boss Ko" ];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
}