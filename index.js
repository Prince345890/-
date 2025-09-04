const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'web')));

// Root route to serve the panel
app.get('/', function (req, res) {
    try {
        res.sendFile(path.join(__dirname, 'web/index.html'));
    } catch (error) {
        logger(`Failed to serve index.html: ${error.message}`, "[ ERROR ]");
        res.status(500).send("Server Error: Could not load the web panel.");
    }
});

// New API endpoint to start the bot
app.post('/start-bot', (req, res) => {
    const { appstate, prefix, adminId, botName } = req.body;

    if (!appstate || !prefix || !adminId || !botName) {
        return res.status(400).json({ error: "सभी फ़ील्ड आवश्यक हैं।" });
    }

    try {
        const appstatePath = path.join(__dirname, 'appstate.json');
        const configPath = path.join(__dirname, 'config.json');

        // Update appstate.json with error handling
        fs.writeFileSync(appstatePath, appstate, 'utf-8');

        // Read, update, and write config.json with error handling
        let config = {};
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        } catch (jsonError) {
            logger(`Failed to parse config.json, creating a new one: ${jsonError.message}`, "[ WARNING ]");
        }
        
        config.PREFIX = prefix;
        config.ADMINBOT = [adminId];
        config.BOTNAME = botName;
        
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');

        // Restart the bot with new config
        startBot("बॉट को नई सेटिंग्स के साथ पुनरारंभ किया जा रहा है...");
        
        res.status(200).json({ message: "बॉट सफलतापूर्वक चालू हो गया है।" });
    } catch (error) {
        logger(`Failed to start bot due to file I/O error: ${error.message}`, "[ ERROR ]");
        res.status(500).json({ error: "बॉट को शुरू करने में असमर्थ।" });
    }
});

app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Error ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Error ]");
    }
});

// Initialize global restart counter
global.countRestart = global.countRestart || 0;
global.botProcess = null;

function startBot(message) {
    if (message) logger(message, "[ Starting ]");
    if (global.botProcess) {
        global.botProcess.kill();
        logger("Existing bot process terminated.", "[ INFO ]");
    }
    
    try {
        // Correctly spawning the new bot process
        global.botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", "prince.js"], {
            cwd: __dirname,
            stdio: "inherit",
            shell: true
        });

        global.botProcess.on("close", (codeExit) => {
            if (codeExit !== 0 && global.countRestart < 5) {
                global.countRestart += 1;
                logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
                startBot();
            } else if (codeExit !== 0) {
                logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
            }
        });

        global.botProcess.on("error", (error) => {
            logger(`An error occurred in the child process: ${JSON.stringify(error)}`, "[ Error ]");
        });
    } catch (error) {
        logger(`Failed to spawn bot process: ${error.message}`, "[ ERROR ]");
    }
};

