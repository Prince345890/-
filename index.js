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
    res.sendFile(path.join(__dirname, 'web/index.html'));
});

// New API endpoint to start the bot
app.post('/start-bot', (req, res) => {
    const { appstate, prefix, adminId, botName, ownerName } = req.body;

    if (!appstate || !prefix || !adminId || !botName || !ownerName) {
        return res.status(400).json({ error: "सभी फ़ील्ड आवश्यक हैं।" });
    }

    try {
        // Update appstate.json with the new appstate
        fs.writeFileSync(path.join(__dirname, 'appstate.json'), appstate, 'utf-8');

        // Read and update config.json with new values
        const configPath = path.join(__dirname, 'config.json');
        let config = {};
        
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }

        // Update config with values from the dashboard
        config.PREFIX = prefix;
        config.ADMINBOT = [adminId]; // Ensure this is an array
        config.BOTNAME = botName;
        config.OWNER_NAME = ownerName; // Added ownerName to config
        
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');
        
        // Restart the bot with new config by spawning the prince.js process
        startBot("बॉट को नई सेटिंग्स के साथ पुनरारंभ किया जा रहा है...");
        
        res.status(200).json({ message: "बॉट सफलतापूर्वक चालू हो गया है।" });
    } catch (error) {
        logger(`Failed to start bot: ${error.message}`, "[ ERROR ]");
        res.status(500).json({ error: "बॉट को शुरू करने में असमर्थ।" });
    }
});

// API endpoint to stop the bot
app.post('/stop-bot', (req, res) => {
    if (global.botProcess) {
        global.botProcess.kill('SIGINT'); // Send a signal to kill the process
        res.status(200).json({ message: "बॉट सफलतापूर्वक बंद हो गया है।" });
    } else {
        res.status(400).json({ error: "बॉट पहले से ही बंद है।" });
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

function startBot(message) {
    if (message) logger(message, "[ Starting ]");
    if (global.botProcess) {
        global.botProcess.kill();
    }
    
    // Use spawn to start the bot
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
        } else {
            logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
        }
    });

    global.botProcess.on("error", (error) => {
        logger(`An error occurred: ${JSON.stringify(error)}`, "[ Error ]");
    });
};
