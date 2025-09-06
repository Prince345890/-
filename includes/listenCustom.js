// listenCustom.js file
module.exports = (data) => {
    const { api } = data;

    // Jab koi bhi message server par aata hai, yeh function run hoga.
    api.listenMqtt((error, event) => {
        if (error) {
            console.error(`Custom Listener Error: ${JSON.stringify(error)}`);
            return;
        }

        // Agar message bot ne khud bheja hai, toh kuch na karein.
        if (event.author === api.getCurrentUserID()) return;

        // Custom command ya listener yahan lagayein.
        // Example: Agar koi user "hello" message bhejta hai
        if (event.body && event.body.toLowerCase() === 'hello') {
            api.sendMessage('Hi! How can I help you?', event.threadID);
        }

        // Example: Jab koi member group mein add hota hai.
        if (event.logMessageType === 'log:subscribe') {
            const addedUserId = event.logMessageData.addedParticipants[0].userFbId;
            api.getUserInfo(addedUserId, (err, info) => {
                if (err) return console.error(err);
                const userName = info[addedUserId].name;
                api.sendMessage(`Welcome to the group, ${userName}!`, event.threadID);
            });
        }
    });
};
