module.exports.config = {
    name: "help3",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SHANKAR-SUMAN",
    description: "beginners guide",
    usages: "[all/-a] [number of pages]",
    commandCategory: "guides",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { commands } = global.client;
    const { threadID } = event;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    
    const commandGroups = new Map();
    const imgP = [];
    
    for (const command of commands.values()) {
        const category = command.config.commandCategory.toUpperCase();
        if (!commandGroups.has(category)) {
            commandGroups.set(category, []);
        }
        commandGroups.get(category).push(`✪${command.config.name}`);
    }
  
    let message = "";
    for (const [category, commands] of commandGroups.entries()) {
        message += `╭────────────✦\n│  ${category}\n├───✦\n`;
        message += `${commands.join(" │")}\n`;
        message += "├───✦\n";
        message += "╰───────────⧕\n\n";
    }
    
    // Using dynamic values from config.json
    const botName = global.config.BOTNAME;
    const ownerName = global.config.OWNER_NAME;
    
    message += `╭────────────✦\n│ »      ☆${botName} 
    《${commands.size} commands》 
    𝓬𝓻𝓮𝓭𝓲𝓽 ● ${ownerName}\n│ » 《${ownerName} PROJECT》\n𝓯𝓮𝓮𝓵 𝓽𝓱𝓮 𝓹𝓸𝔀𝓮𝓻 𝓸𝓯 ${ownerName}\n╰────────────✦`;
    
    return api.sendMessage(message, threadID, (error, info) => {
        if (error) console.log(error);
    });
}
