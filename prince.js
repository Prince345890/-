const moment = require("moment-timezone");
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("fca-unofficial");
const axios = require("axios");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;

module.exports = function (botConfig) {
    let api = null;
    let listener = null;

    global.client = new Object({
        commands: new Map(),
        events: new Map(),
        cooldowns: new Map(),
        eventRegistered: new Array(),
        handleSchedule: new Array(),
        handleReaction: new Array(),
        handleReply: new Array(),
        mainPath: process.cwd(),
        configPath: new String(),
        ownerName: botConfig.ownerName,
        adminId: botConfig.adminId,
        prefix: botConfig.prefix,
        getTime: function (option) {
            switch (option) {
                case "seconds": return `${moment.tz("Asia/Kolkata").format("ss")}`;
                case "minutes": return `${moment.tz("Asia/Kolkata").format("mm")}`;
                case "hours": return `${moment.tz("Asia/Kolkata").format("HH")}`;
                case "date": return `${moment.tz("Asia/Kolkata").format("DD")}`;
                case "month": return `${moment.tz("Asia/Kolkata").format("MM")}`;
                case "year": return `${moment.tz("Asia/Kolkata").format("YYYY")}`;
                case "fullHour": return `${moment.tz("Asia/Kolkata").format("HH:mm:ss")}`;
                case "fullYear": return `${moment.tz("Asia/Kolkata").format("DD/MM/YYYY")}`;
                case "fullTime": return `${moment.tz("Asia/Kolkata").format("HH:mm:ss DD/MM/YYYY")}`;
            }
        }
    });

    global.data = new Object({
        threadInfo: new Map(),
        threadData: new Map(),
        userName: new Map(),
        userBanned: new Map(),
        threadBanned: new Map(),
        commandBanned: new Map(),
        threadAllowNSFW: new Array(),
        allUserID: new Array(),
        allCurrenciesID: new Array(),
        allThreadID: new Array()
    });

    global.utils = require("./utils");
    global.nodemodule = new Object();
    global.config = new Object();
    global.configModule = new Object();
    global.moduleData = new Array();
    global.language = new Object();

    // Load config from received data
    global.config = botConfig;
    logger.loader("Config Loaded from Dashboard!");

    const { Sequelize, sequelize } = require("./includes/database");

    // Load language
    try {
        const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
        const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
        for (const item of langData) {
            const getSeparator = item.indexOf('=');
            const itemKey = item.slice(0, getSeparator);
            const itemValue = item.slice(getSeparator + 1, item.length);
            const head = itemKey.slice(0, itemKey.indexOf('.'));
            const key = itemKey.replace(head + '.', '');
            const value = itemValue.replace(/\\n/gi, '\n');
            if (typeof global.language[head] == "undefined") global.language[head] = new Object();
            global.language[head][key] = value;
        }
    } catch (error) {
        logger.loader(`Failed to load language file: ${error}`, 'ERROR');
    }

    global.getText = function (...args) {
        const langText = global.language;
        if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
        var text = langText[args[0]][args[1]];
        for (var i = args.length - 1; i > 0; i--) {
            const regEx = RegExp(`%${i}`, 'g');
            text = text.replace(regEx, args[i + 1]);
        }
        return text;
    }

    try {
        var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
        var appState = require(appStateFile);
        logger.loader("Found file appstate: appstate.json");
    } catch {
        return logger.loader("appstate.json not found!", "error");
    }

    // Login account and start Listen Event
    function onBot({ models: botModel }) {
        const loginData = {};
        loginData['appState'] = appState;
        
        login(loginData, async(loginError, loginApiData) => {
            if (loginError) return logger(JSON.stringify(loginError), `LOGIN ERROR`);
            api = loginApiData;
            loginApiData.setOptions(global.config.FCAOption);
            writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'));

            global.client.api = loginApiData;
            global.config.version = '1.2.14';
            global.client.timeStart = new Date().getTime();

            // Load commands
            const listCommand = readdirSync(global.client.mainPath + '/Prince/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
            for (const command of listCommand) {
                try {
                    var module = require(global.client.mainPath + '/Prince/commands/' + command);
                    if (!module.config || !module.run || !module.config.commandCategory) throw new Error("Module format error!");
                    if (global.client.commands.has(module.config.name || '')) throw new Error("Module name already exists!");

                    if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                        for (const reqDependencies in module.config.dependencies) {
                            const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                            try {
                                if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                    if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                    else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                }
                            } catch {
                                var check = false;
                                var isError;
                                logger.loader(`Can't find package "${reqDependencies}" for module ${module.config.name}`, 'warn');
                                execSync('npm --package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                for (let i = 1; i <= 3; i++) {
                                    try {
                                        require['cache'] = {};
                                        if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                        else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                        check = true;
                                        break;
                                    } catch (error) { isError = error; }
                                    if (check || !isError) break;
                                }
                                if (!check || isError) throw `Can't install package "${reqDependencies}" for module ${module.config.name}, error: ${isError}`;
                            }
                        }
                        logger.loader(`Loaded dependencies for module: ${module.config.name}`);
                    }
                    if (module.config.envConfig) try {
                        for (const envConfig in module.config.envConfig) {
                            if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                            if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                            if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                            else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                            if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                        }
                        logger.loader(`Loaded environment config for module: ${module.config.name}`);
                    } catch (error) {
                        throw new Error(`Failed to load environment config for module ${module.config.name}: ${JSON.stringify(error)}`);
                    }
                    if (module.onLoad) {
                        try {
                            const moduleData = {};
                            moduleData.api = loginApiData;
                            moduleData.models = botModel;
                            module.onLoad(moduleData);
                        } catch (e) {
                            throw new Error(`onLoad failed for ${module.config.name}: ${JSON.stringify(e)}`);
                        };
                    }
                    if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                    global.client.commands.set(module.config.name, module);
                    logger.loader(`Successfully loaded module: ${module.config.name}`);
                } catch (error) {
                    logger.loader(`Failed to load module "${command}": ${error}`, 'error');
                };
            }
            // Load events
            const events = readdirSync(global.client.mainPath + '/Prince/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
            for (const ev of events) {
                try {
                    var event = require(global.client.mainPath + '/Prince/events/' + ev);
                    if (!event.config || !event.run) throw new Error("Event format error!");
                    if (global.client.events.has(event.config.name) || '') throw new Error("Event name already exists!");

                    if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                        for (const dependency in event.config.dependencies) {
                            const depPath = join(__dirname, 'nodemodules', 'node_modules', dependency);
                            try {
                                if (!global.nodemodule.hasOwnProperty(dependency)) {
                                    if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                    else global.nodemodule[dependency] = require(depPath);
                                }
                            } catch {
                                let check = false;
                                let isError;
                                logger.loader(`Can't find package "${dependency}" for event ${event.config.name}`, 'warn');
                                execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                for (let i = 1; i <= 3; i++) {
                                    try {
                                        require['cache'] = {};
                                        if (global.nodemodule.includes(dependency)) break;
                                        if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                        else global.nodemodule[dependency] = require(depPath);
                                        check = true;
                                        break;
                                    } catch (error) { isError = error; }
                                    if (check || !isError) break;
                                }
                                if (!check || isError) throw `Can't install package "${dependency}" for event ${event.config.name}, error: ${isError}`;
                            }
                        }
                        logger.loader(`Loaded dependencies for event: ${event.config.name}`);
                    }
                    if (event.config.envConfig) try {
                        for (const envConfig in event.config.envConfig) {
                            if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                            if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                            if (typeof global.config[event.config.name][envConfig] !== 'undefined') global.configModule[event.config.name][envConfig] = global.config[event.config.name][envConfig];
                            else global.configModule[event.config.name][envConfig] = event.config.envConfig[envConfig] || '';
                            if (typeof global.config[event.config.name][envConfig] == 'undefined') global.config[event.config.name][envConfig] = event.config.envConfig[envConfig] || '';
                        }
                        logger.loader(`Loaded environment config for event: ${event.config.name}`);
                    } catch (error) {
                        throw new Error(`Failed to load environment config for event ${event.config.name}: ${JSON.stringify(error)}`);
                    }
                    if (event.onLoad) try {
                        const eventData = {};
                        eventData.api = loginApiData, eventData.models = botModel;
                        event.onLoad(eventData);
                    } catch (error) {
                        throw new Error(`onLoad failed for ${event.config.name}: ${JSON.stringify(error)}`);
                    }
                    global.client.events.set(event.config.name, event);
                    logger.loader(`Successfully loaded event: ${event.config.name}`);
                } catch (error) {
                    logger.loader(`Failed to load event "${ev}": ${error}`, 'error');
                }
            }
            logger.loader(`Finished loading modules! Commands: ${global.client.commands.size}, Events: ${global.client.events.size}`);
            logger.loader(`Startup Time: ${((Date.now() - global.client.timeStart) / 1000).toFixed(2)}s`);
            logger.loader('===== [ ' + (Date.now() - global.client.timeStart) + 'ms ] =====');

            const listenerData = {};
            listenerData.api = loginApiData;
            listenerData.models = botModel;
            listener = require('./includes/listen')(listenerData);

            function listenerCallback(error, message) {
                if (error) return logger(`Listen error: ${JSON.stringify(error)}`, 'error');
                if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
                if (global.config.DeveloperMode) console.log(message);
                return listener(message);
            };
            global.handleListen = loginApiData.listenMqtt(listenerCallback);
        });
    }

    // Connecting to Database
    (async () => {
        try {
            await sequelize.authenticate();
            const authentication = {};
            authentication.Sequelize = Sequelize;
            authentication.sequelize = sequelize;
            const models = require('./includes/database/model')(authentication);
            logger('Successfully connected to the database!', '[ DATABASE ]');
            const botData = {};
            botData.models = models
            onBot(botData);
        } catch (error) {
            logger(`Database connection failed: ${error.message}`, '[ DATABASE FAILED ]');
            onBot({}); // Continue without a database
        }
    })();

    process.on('unhandledRejection', (err, p) => {
        logger(`Unhandled Rejection at: Promise ${p}, reason: ${err}`, 'UNHANDLED REJECTION');
    });

    process.on('uncaughtException', (err) => {
        logger(`Caught an uncaught exception: ${err.stack}`, "UNCAUGHT EXCEPTION");
    });

    return {
        stop: () => {
            if (api) {
                api.stopListening();
                api = null;
                logger("Bot stopped successfully.", "INFO");
            }
        }
    };
};
