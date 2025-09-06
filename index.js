const { spawn } = require("child_process");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'web')));

let botProcess = null;
let activeUsers = new Set();
let activeGroups = new Set();
let botStartTime = null;

// Function to send real-time logs and data to dashboard
function sendToDashboard(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Routes for dashboard
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'web/index.html'));
});

app.post('/start-bot', (req, res) => {
    const { appstate, botName, ownerName, adminId, dpLink, age, relation, from, study, fbLink, whatsappNo, gfName } = req.body;
    
    if (!appstate || !botName || !ownerName) {
        return res.status(400).json({ error: "सभी फ़ील्ड आवश्यक हैं।" });
    }

    try {
        fs.writeFileSync(path.join(__dirname, 'appstate.json'), appstate, 'utf-8');

        const configPath = path.join(__dirname, 'config.json');
        const profilePath = path.join(__dirname, 'ownerProfile.json');
        
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }

        config.BOTNAME = botName;
        config.OWNER_NAME = ownerName;
        if (adminId) config.ADMINBOT = [adminId];
        
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');

        if (dpLink || age || relation || from || study || fbLink || whatsappNo || gfName) {
            const profileData = { name: ownerName, age, relation, from, study, fbLink, whatsappNo, gfName, dpLink };
            fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 4), 'utf-8');
        }

        startBot("बॉट को नई सेटिंग्स के साथ पुनरारंभ किया जा रहा है...");
        
        res.status(200).json({ message: "बॉट सफलतापूर्वक चालू हो गया है।" });
    } catch (error) {
        logger(`Failed to start bot: ${error.message}`, "[ ERROR ]");
        res.status(500).json({ error: "बॉट को शुरू करने में असमर्थ।" });
    }
});

app.post('/stop-bot', (req, res) => {
    if (botProcess) {
        botProcess.kill('SIGINT');
        res.status(200).json({ message: "बॉट सफलतापूर्वक बंद हो गया है।" });
    } else {
        res.status(400).json({ error: "बॉट पहले से ही बंद है।" });
    }
});

server.listen(port, () => {
    logger(`Dashboard server running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Error ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Error ]");
    }
});

// WebSocket for real-time data
wss.on('connection', ws => {
    console.log('Dashboard connected via WebSocket.');
    
    // Send initial status
    ws.send(JSON.stringify({
        type: 'initial_status',
        status: botProcess ? 'online' : 'offline',
        uptime: botStartTime ? Math.floor((Date.now() - botStartTime) / 1000) : 0,
        groups: activeGroups.size,
        users: activeUsers.size
    }));
});

// Update metrics periodically
setInterval(() => {
    if (botProcess) {
        const uptime = Math.floor((Date.now() - botStartTime) / 1000);
        sendToDashboard({
            type: 'metrics',
            uptime,
            groups: activeGroups.size,
            users: activeUsers.size
        });
    }
}, 5000);

function startBot(message) {
    if (message) sendToDashboard({ type: 'log', message: `[DASHBOARD] ${message}` });
    if (botProcess) {
        botProcess.kill();
    }
    
    botStartTime = Date.now();
    activeUsers.clear();
    activeGroups.clear();

    botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", "priyansh.js"], {
        cwd: __dirname,
        stdio: ["inherit", "pipe", "pipe"],
        shell: true
    });

    botProcess.stdout.on('data', (data) => {
        const logMessage = data.toString().trim();
        sendToDashboard({ type: 'log', message: logMessage });
        
        // Logic to extract active groups and users from logs
        const threadMatch = logMessage.match(/threadID: (.+)/);
        const userMatch = logMessage.match(/senderID: (.+)/);
        
        if (threadMatch) {
            activeGroups.add(threadMatch[1]);
        }
        
        if (userMatch) {
            activeUsers.add(userMatch[1]);
        }
    });

    botProcess.stderr.on('data', (data) => {
        sendToDashboard({ type: 'log', message: `[BOT ERROR] ${data.toString()}` });
    });

    botProcess.on("close", (code) => {
        botProcess = null;
        botStartTime = null;
        sendToDashboard({ type: 'status', status: 'offline' });
        sendToDashboard({ type: 'log', message: `[DASHBOARD] Bot exited with code ${code}.` });
    });
};

