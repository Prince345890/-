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
    
    global.config = botConfig;
    logger.loader("Config Loaded from Dashboard!");

    const { Sequelize, sequelize } = require("./includes/database");

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
        if (!langText.hasOwnProperty(args[0])) return `Language key not found: ${args[0]}.${args[1]}`;
        var text = langText[args[0]][args[1]];
        if (!text) return `Language key not found: ${args[0]}.${args[1]}`;
        for (var i = args.length - 1; i > 0; i--) {
            const regEx = RegExp(`%${i}`, 'g');
            text = text.replace(regEx, args[i + 1]);
        }
        return text;
    }

    try {
        var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
        var appState = global.config.appstate;
        logger.loader(global.getText("appName", "foundPathAppstate"));
    }
    catch (e) {
        console.error(e);
        return logger.loader(global.getText("appName", "notFoundPathAppstate"), "error");
    }

    function onBot({ models: botModel }) {
        const loginData = {};
        loginData['appState'] = appState;
        
        // Added `try...catch` block for login
        try {
            login(loginData, async(loginError, loginApiData) => {
                if (loginError) {
                    logger(JSON.stringify(loginError), `LOGIN ERROR`);
                    return; // Return here to prevent further execution on login failure
                }
                api = loginApiData;
                loginApiData.setOptions(global.config.FCAOption);
                writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'));
                global.client.api = loginApiData;
                global.config.version = '1.2.14';
                global.client.timeStart = new Date().getTime(),
                
                // Load commands
                function () {
                    const listCommand = readdirSync(global.client.mainPath + '/Prince/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
                    for (const command of listCommand) {
                        try {
                            var module = require(global.client.mainPath + '/Prince/commands/' + command);
                            if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('appName', 'errorFormat'));
                            if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('appName', 'nameExist'));
                            if (!module.languages || typeof module.languages != 'object' || Object.keys(module.languages).length == 0) logger.loader(global.getText('appName', 'notFoundLanguage', module.config.name), 'warn');
                            
                            // Load dependencies with error handling
                            if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                                for (const reqDependencies in module.config.dependencies) {
                                    const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                                    try {
                                        if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                            else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                        }
                                    } catch (error) {
                                        logger.loader(global.getText('appName', 'notFoundPackage', reqDependencies, module.config.name) + `: ${error}`, 'warn');
                                        try {
                                            execSync('npm --package-lock false --save install ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                            require['cache'] = {};
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                            else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                        } catch (installError) {
                                            logger.loader(`Failed to install dependency ${reqDependencies} for module ${module.config.name}: ${installError}`, 'error');
                                        }
                                    }
                                }
                                logger.loader(global.getText('appName', 'loadedPackage', module.config.name));
                            }
                            
                            // Load envConfig with error handling
                            if (module.config.envConfig) {
                                try {
                                    for (const envConfig in module.config.envConfig) {
                                        if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                                        if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                                        if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                                        else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                        if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                    }
                                    logger.loader(global.getText('appName', 'loadedConfig', module.config.name));
                                } catch (error) {
                                    throw new Error(global.getText('appName', 'loadedConfig', module.config.name, JSON.stringify(error)));
                                }
                            }
                            
                            // Run onLoad with error handling
                            if (module.onLoad) {
                                try {
                                    const moduleData = {};
                                    moduleData.api = loginApiData;
                                    moduleData.models = botModel;
                                    module.onLoad(moduleData);
                                } catch (_0x20fd5f) {
                                    throw new Error(global.getText('appName', 'cantOnload', module.config.name, JSON.stringify(_0x20fd5f)), 'error');
                                };
                            }
                            
                            if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                            global.client.commands.set(module.config.name, module);
                            logger.loader(global.getText('appName', 'successLoadModule', module.config.name));
                        } catch (error) {
                            logger.loader(global.getText('appName', 'failLoadModule', command, error), 'error');
                        };
                    }
                }(),
                
                // Load events
                function() {
                    const events = readdirSync(global.client.mainPath + '/Prince/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
                    for (const ev of events) {
                        try {
                            var event = require(global.client.mainPath + '/Prince/events/' + ev);
                            if (!event.config || !event.run) throw new Error(global.getText('appName', 'errorFormat'));
                            if (global.client.events.has(event.config.name) || '') throw new Error(global.getText('appName', 'nameExist'));
                            
                            // Load dependencies with error handling
                            if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                                for (const dependency in event.config.dependencies) {
                                    const _0x21abed = join(__dirname, 'nodemodules', 'node_modules', dependency);
                                    try {
                                        if (!global.nodemodule.hasOwnProperty(dependency)) {
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(_0x21abed);
                                        }
                                    } catch (error) {
                                        logger.loader(global.getText('appName', 'notFoundPackage', dependency, event.config.name) + `: ${error}`, 'warn');
                                        try {
                                            execSync('npm --package-lock false --save install ' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                            require['cache'] = {};
                                            if (global.nodemodule.includes(dependency)) break;
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(_0x21abed);
                                        } catch (installError) {
                                            logger.loader(`Failed to install dependency ${dependency} for event ${event.config.name}: ${installError}`, 'error');
                                        }
                                    }
                                }
                                logger.loader(global.getText('appName', 'loadedPackage', event.config.name));
                            }
                            
                            // Load envConfig with error handling
                            if (event.config.envConfig) {
                                try {
                                    for (const _0x5beea0 in event.config.envConfig) {
                                        if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                                        if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                                        if (typeof global.config[event.config.name][_0x5beea0] !== 'undefined') global.configModule[event.config.name][_0x5beea0] = global.config[event.config.name][_0x5beea0];
                                        else global.configModule[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                        if (typeof global.config[event.config.name][_0x5beea0] == 'undefined') global.config[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                    }
                                    logger.loader(global.getText('appName', 'loadedConfig', event.config.name));
                                } catch (error) {
                                    throw new Error(global.getText('appName', 'loadedConfig', event.config.name, JSON.stringify(error)));
                                }
                            }
                            
                            // Run onLoad with error handling
                            if (event.onLoad) {
                                try {
                                    const eventData = {};
                                    eventData.api = loginApiData, eventData.models = botModel;
                                    event.onLoad(eventData);
                                } catch (error) {
                                    throw new Error(global.getText('appName', 'cantOnload', event.config.name, JSON.stringify(error)), 'error');
                                }
                            }
                            global.client.events.set(event.config.name, event);
                            logger.loader(global.getText('appName', 'successLoadModule', event.config.name));
                        } catch (error) {
                            logger.loader(global.getText('appName', 'failLoadModule', ev, error), 'error');
                        }
                    }
                }()
                
                logger.loader(global.getText('appName', 'finishLoadModule', global.client.commands.size, global.client.events.size));
                logger.loader(`Startup Time: ${((Date.now() - global.client.timeStart) / 1000).toFixed()}s`);
                logger.loader('===== [ ' + (Date.now() - global.client.timeStart) + 'ms ] =====');
                
                const listenerData = {};
                listenerData.api = loginApiData;
                listenerData.models = botModel;
                
                try {
                    const listener = require('./includes/listen')(listenerData);
                    function listenerCallback(error, message) {
                        if (error) return logger(global.getText('appName', 'handleListenError', JSON.stringify(error)), 'error');
                        if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
                        if (global.config.DeveloperMode) console.log(message);
                        return listener(message);
                    };
                    global.handleListen = loginApiData.listenMqtt(listenerCallback);
                } catch (error) {
                    logger("Error while setting up listener: " + error, "ERROR");
                }
            });
        } catch (loginSetupError) {
            logger("Critical error during login setup: " + loginSetupError, "FATAL ERROR");
        }
    }

    (async () => {
        try {
            const { Sequelize, sequelize } = require("./includes/database");
            await sequelize.authenticate();
            const authentication = {};
            authentication.Sequelize = Sequelize;
            authentication.sequelize = sequelize;
            const models = require('./includes/database/model')(authentication);
            logger(global.getText('appName', 'successConnectDatabase'), '[ DATABASE ]');
            const botData = {};
            botData.models = models;
            onBot(botData);
        } catch (error) {
            logger(global.getText('appName', 'successConnectDatabase', JSON.stringify(error)), '[ DATABASE CONNECTION FAILED ]');
            // Bot will still attempt to start even if the database connection fails
            const botData = {};
            onBot(botData);
        }
    })();

    // Global uncaught exception handler
    process.on('uncaughtException', (err) => {
        logger("Caught an uncaught exception: " + err, "UNCAUGHT EXCEPTION");
        // Don't exit the process immediately, log the error and continue
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
