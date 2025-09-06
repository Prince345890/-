module.exports = {
  config: {
    name: "bd",
    version: "1.0",
    author: "julmi",
    role: 0,
    category: "𝗪𝗜𝗦𝗛𝗘𝗦𝗛",
    guide: {
      vi: "Not Available",
      en: "cpx <time> @(mention)"
    }
  },

  onStart: async function ({ api, event, userData, args }) {
    var mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("Need to tag 1 friend whome you want to birthday wish.", event.threadID);

    let name = event.mentions[mention];
    var arraytag = [];
    arraytag.push({ id: mention, tag: name });

    // Time parsing logic to get baseDelay
    const timeArg = args[1];

    function parseTimeString(timeStr) {
      if (!timeStr) return 0;
      let hours = 0, minutes = 0, seconds = 0;
      const hourMatch = timeStr.match(/(\d+)h/);
      if (hourMatch) hours = parseInt(hourMatch[1]);
      const minuteMatch = timeStr.match(/(\d+)m/);
      if (minuteMatch) minutes = parseInt(minuteMatch[1]);
      const secondMatch = timeStr.match(/(\d+)s/);
      if (secondMatch) seconds = parseInt(secondMatch[1]);
      return (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
    }

    let baseDelay = parseTimeString(timeArg);

    // Agar koi time nahi diya gaya to wishes turant send hongi
    if (baseDelay === 0) {
      sendAllWishes(api, event, name, arraytag);
      return;
    }

    // Reminder and Countdown Logic
    const startTime = Date.now();
    const endTime = startTime + baseDelay;
    const reminderInterval = 10 * 60 * 1000; // 10 minutes

    api.sendMessage(`✅ Birthday wish scheduled for ${name} in ${timeArg}. I'll send reminders every 10 minutes.`, event.threadID);

    const reminderTimer = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTime - now;

      // Convert timeLeft to hours and minutes for the message
      const hoursLeft = Math.floor(timeLeft / 3600000);
      const minutesLeft = Math.floor((timeLeft % 3600000) / 60000);

      if (timeLeft <= 10000) { // Last 10 seconds remaining
        clearInterval(reminderTimer);
        api.sendMessage(`✨ The birthday wishes are about to begin for ${name}!`, event.threadID);

        let countdown = 10;
        const countdownInterval = setInterval(() => {
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            // Call the function to send all wishes
            sendAllWishes(api, event, name, arraytag);
          } else {
            api.sendMessage(`${countdown}...`, event.threadID);
            countdown--;
          }
        }, 1000);
      } else {
        // Send a reminder every 10 minutes
        api.sendMessage(`🔔 REMINDER: Only ${hoursLeft}h ${minutesLeft}m left for ${name}'s birthday wish!`, event.threadID);
      }
    }, reminderInterval);

    // Main function to send all wishes
    function sendAllWishes(api, event, name, arraytag) {
      function sendWish(message) {
        api.sendMessage({ body: message + " " + name, mentions: arraytag }, event.threadID);
      }

      setTimeout(() => { sendWish("🥳🎉🎂 HAPPY BIRTHDAY TO YOU 🍰🎁🎈🧁🕯️"); }, 0);
      setTimeout(() => { sendWish("🎁जन्मदिन 🍰मुबारक हो !🥳"); }, 3000);
      //... (rest of your wishes)
      setTimeout(() => { sendWish("🎁खुशियां आपके ज़िंदगी में बेहिसाब हो, 🕯️आज का हर एक पल ख़ास हो। - 🍰Happy Birthday🧁"); }, 108000);
      setTimeout(() => { sendWish("🎂कामयाबी के शिखर पर आपका ही नाम हो,🎁 आप हर एक कदम पर दुनिया का सलाम हो। - 🍰जन्मदिन की शुभकामनाएं🕯️"); }, 111000);
      setTimeout(() => { sendWish("🎉इस जन्मदिन आप अपने सपने बताओ🎁 नहीं बल्कि सबको दिखाओ। - 🎂हैप्पी बर्थडे🍰"); }, 114000);
      setTimeout(() => { sendWish("*cake7🕯️कोशिश करो ऐसा की हर सपना साकार हो, 🎂ईश्वर करें की दुनियां में बस आपके ही नाम का शोर हो। - 🥳Happy Birthday🎈"); }, 117000);
      setTimeout(() => { sendWish("🍰ऊपर वाला हम से भी पहले आपकी दुआ कबूल करें, 🕯️आपकी उम्र बढ़ती रहें लेकिन इसी तरह जवान दिखती रहें। - 🎁हैप्पी बर्थडे🎂"); }, 120000);
      setTimeout(() => { sendWish("🍰 कुछ ऐसा हो की सब को आप पे गुरुर हो,🎉 आज वक्त का तू गुलाम है, 🕯️पर कल वक्त भी तेरा गुलाम हो। - 🎂Happy Birthday🎁"); }, 123000);
      setTimeout(() => { sendWish("*birthday 🎂 इस जन्म दिवस के अवसर पर भगवान से यही प्रार्थना है की,🍰 आपकी हर प्रार्थना पूरी हो। - 🎉हैप्पी बर्थडे🎁"); }, 126000);
      setTimeout(() => { sendWish("🍰आपकी ज़िंदगी में नई रौशनी आये और आप सितारों सा चमकें। - 🕯️Happy Birthday🎂"); }, 129000);
      setTimeout(() => { sendWish("*birthvideo 🍰 हर राह आसान हो,🎈 हर राह पे खुशिया हो🎁, हर दिन ख़ूबसूरत हो, 🎉ऐसा ही आपका हर जन्मदिन हो..!! - 🎂Happy Birthday🥳"); }, 132000);
      setTimeout(() => { sendWish("🎈इस जन्म दिवस के मौके पर आपको उम्मीद जैसी ऊर्जा मिले,🧁 जिससे आप अपने ज़िंदगी के अँधेरे हिस्से को रौशन कर सकें। - 🍰जन्मदिन की शुभकामनाएं🎁"); }, 135000);
      setTimeout(() => { sendWish("🎉आपकी हसी चेहरे पे हमेशा रहे,🎂 आप जीवन का हर पड़ाव अच्छे से निभाये,🕯️ ऐसी इश्वर से कामना है मेरी। - 🍰जन्मदिन की शुभकामनाएं🤔"); }, 138000);
      setTimeout(() => { sendWish("🕯️चंद लम्हें जो तुमने जी है 🍰हमारे साथ वो याद करलो कभी, 🎂पास अभी आ नहीं सकते तुम्हारे इस दूरी को नज़दीकी समझलो कभी,🎉 एक साल तो अपना जन्मदिन हमारे बिना मनालो कभी। - 🧁Happy Birthday🎁"); }, 141000);
      setTimeout(() => { sendWish("*cake8 🍰ये लो तुम्हारा 🎁 Birthday Gift… 1000 Rs. का Scratch कार्ड… तुम भी क्या याद करोंगे… कर लो ऐश 😉 ░░░░░░░░░░░░ Scratch करो wish करों…🤪😜😝😅\n                       🍬🎂Happy Birthday🎂🍬"); }, 144000);
      setTimeout(() => { sendWish("🥳🎉🎂 HAPPY BIRTHDAY TO YOU 🍰🎁🎈🧁🕯️"); }, 147000);
      setTimeout(() => { sendWish("*birthday" + " " + name); }, 150000);
    }
  }
};
