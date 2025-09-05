const moment = require("moment-timezone");
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("fca-prince"); // Changed to prince
const axios = require("axios");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;

module.exports = function (botConfig) { // Added module.exports to make it a function
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
        botName: botConfig.BOT_NAME, // Added dynamic bot name
        ownerName: botConfig.OWNER_NAME, // Added dynamic owner name
        adminId: botConfig.ADMIN_ID, // Added dynamic admin id
        prefix: botConfig.PREFIX, // Added dynamic prefix
        getTime: function (option) {
            switch (option) {
                case "seconds":
                    return `${moment.tz("Asia/Kolkata").format("ss")}`;
                case "minutes":
                    return `${moment.tz("Asia/Kolkata").format("mm")}`;
                case "hours":
                    return `${moment.tz("Asia/Kolkata").format("HH")}`;
                case "date":
                    return `${moment.tz("Asia/Kolkata").format("DD")}`;
                case "month":
                    return `${moment.tz("Asia/Kolkata").format("MM")}`;
                case "year":
                    return `${moment.tz("Asia/Kolkata").format("YYYY")}`;
                case "fullHour":
                    return `${moment.tz("Asia/Kolkata").format("HH:mm:ss")}`;
                case "fullYear":
                    return `${moment.tz("Asia/Kolkata").format("DD/MM/YYYY")}`;
                case "fullTime":
                    return `${moment.tz("Asia/Kolkata").format("HH:mm:ss DD/MM/YYYY")}`;
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

    // Now reading config from botConfig object passed from index.js
    for (const key in botConfig) global.config[key] = botConfig[key];
    logger.loader("Config Loaded from Dashboard!");

    // Removed the old config.json read logic, as it's now coming from botConfig

    const { Sequelize, sequelize } = require("./includes/database");

    // writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8'); // Not needed for dynamic config

    /////////////////////////////////////////
    //========= Load language use =========//
    /////////////////////////////////////////

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
        writeFileSync(appStateFile, JSON.stringify(botConfig.appstate, null, '\x09')); // Writing appstate from botConfig
        var appState = require(appStateFile);
        logger.loader(global.getText("prince", "foundPathAppstate")) // Changed from priyansh to prince
    }
    catch {
        return logger.loader(global.getText("prince", "notFoundPathAppstate"), "error") // Changed from priyansh to prince
    }

    //========= Login account and start Listen Event =========//

    function onBot({ models: botModel }) {
        const loginData = {};
        loginData['appState'] = appState;
        login(loginData, async(loginError, loginApiData) => {
            if (loginError) return logger(JSON.stringify(loginError), `ERROR`);
            loginApiData.setOptions(global.config.FCAOption)
            writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'))
            global.client.api = loginApiData
            global.config.version = '1.2.14'
            global.client.timeStart = new Date().getTime(),
                function () {
                    const listCommand = readdirSync(global.client.mainPath + '/Prince/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command)); // Changed Priyansh to Prince
                    for (const command of listCommand) {
                        try {
                            var module = require(global.client.mainPath + '/Prince/commands/' + command); // Changed Priyansh to Prince
                            if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('prince', 'errorFormat')); // Changed from priyansh to prince
                            if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('prince', 'nameExist')); // Changed from priyansh to prince
                            if (!module.languages || typeof module.languages != 'object' || Object.keys(module.languages).length == 0) logger.loader(global.getText('prince', 'notFoundLanguage', module.config.name), 'warn'); // Changed from priyansh to prince
                            if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                                for (const reqDependencies in module.config.dependencies) {
                                    const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                                    try {
                                        if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                            else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                        } else '';
                                    } catch {
                                        var check = false;
                                        var isError;
                                        logger.loader(global.getText('prince', 'notFoundPackage', reqDependencies, module.config.name), 'warn'); // Changed from priyansh to prince
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
                                        if (!check || isError) throw global.getText('prince', 'cantInstallPackage', reqDependencies, module.config.name, isError); // Changed from priyansh to prince
                                    }
                                }
                                logger.loader(global.getText('prince', 'loadedPackage', module.config.name)); // Changed from priyansh to prince
                            }
                            if (module.config.envConfig) try {
                                for (const envConfig in module.config.envConfig) {
                                    if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                                    if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                                    if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                                    else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                    if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                }
                                logger.loader(global.getText('prince', 'loadedConfig', module.config.name)); // Changed from priyansh to prince
                            } catch (error) {
                                throw new Error(global.getText('prince', 'loadedConfig', module.config.name, JSON.stringify(error))); // Changed from priyansh to prince
                            }
                            if (module.onLoad) {
                                try {
                                    const moduleData = {};
                                    moduleData.api = loginApiData;
                                    moduleData.models = botModel;
                                    module.onLoad(moduleData);
                                } catch (_0x20fd5f) {
                                    throw new Error(global.getText('prince', 'cantOnload', module.config.name, JSON.stringify(_0x20fd5f)), 'error'); // Changed from priyansh to prince
                                };
                            }
                            if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                            global.client.commands.set(module.config.name, module);
                            logger.loader(global.getText('prince', 'successLoadModule', module.config.name)); // Changed from priyansh to prince
                        } catch (error) {
                            logger.loader(global.getText('prince', 'failLoadModule', module.config.name, error), 'error'); // Changed from priyansh to prince
                        };
                    }
                }(),
                function() {
                    const events = readdirSync(global.client.mainPath + '/Prince/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event)); // Changed Priyansh to Prince
                    for (const ev of events) {
                        try {
                            var event = require(global.client.mainPath + '/Prince/events/' + ev); // Changed Priyansh to Prince
                            if (!event.config || !event.run) throw new Error(global.getText('prince', 'errorFormat')); // Changed from priyansh to prince
                            if (global.client.events.has(event.config.name) || '') throw new Error(global.getText('prince', 'nameExist')); // Changed from priyansh to prince
                            if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                                for (const dependency in event.config.dependencies) {
                                    const _0x21abed = join(__dirname, 'nodemodules', 'node_modules', dependency);
                                    try {
                                        if (!global.nodemodule.hasOwnProperty(dependency)) {
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(_0x21abed);
                                        } else '';
                                    } catch {
                                        let check = false;
                                        let isError;
                                        logger.loader(global.getText('prince', 'notFoundPackage', dependency, event.config.name), 'warn'); // Changed from priyansh to prince
                                        execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                        for (let i = 1; i <= 3; i++) {
                                            try {
                                                require['cache'] = {};
                                                if (global.nodemodule.includes(dependency)) break;
                                                if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                                else global.nodemodule[dependency] = require(_0x21abed);
                                                check = true;
                                                break;
                                            } catch (error) { isError = error; }
                                            if (check || !isError) break;
                                        }
                                        if (!check || isError) throw global.getText('prince', 'cantInstallPackage', dependency, event.config.name); // Changed from priyansh to prince
                                    }
                                }
                                logger.loader(global.getText('prince', 'loadedPackage', event.config.name)); // Changed from priyansh to prince
                            }
                            if (event.config.envConfig) try {
                                for (const _0x5beea0 in event.config.envConfig) {
                                    if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                                    if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                                    if (typeof global.config[event.config.name][_0x5beea0] !== 'undefined') global.configModule[event.config.name][_0x5beea0] = global.config[event.config.name][_0x5beea0];
                                    else global.configModule[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                    if (typeof global.config[event.config.name][_0x5beea0] == 'undefined') global.config[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                }
                                logger.loader(global.getText('prince', 'loadedConfig', event.config.name)); // Changed from priyansh to prince
                            } catch (error) {
                                throw new Error(global.getText('prince', 'loadedConfig', event.config.name, JSON.stringify(error))); // Changed from priyansh to prince
                            }
                            if (event.onLoad) try {
                                const eventData = {};
                                eventData.api = loginApiData, eventData.models = botModel;
                                event.onLoad(eventData);
                            } catch (error) {
                                throw new Error(global.getText('prince', 'cantOnload', event.config.name, JSON.stringify(error)), 'error'); // Changed from priyansh to prince
                            }
                            global.client.events.set(event.config.name, event);
                            logger.loader(global.getText('prince', 'successLoadModule', event.config.name)); // Changed from priyansh to prince
                        } catch (error) {
                            logger.loader(global.getText('prince', 'failLoadModule', event.config.name, error), 'error'); // Changed from priyansh to prince
                        }
                    }
                }()
            logger.loader(global.getText('prince', 'finishLoadModule', global.client.commands.size, global.client.events.size)) // Changed from priyansh to prince
            logger.loader(`Startup Time: ${((Date.now() - global.client.timeStart) / 1000).toFixed()}s`)
            logger.loader('===== [ ' + (Date.now() - global.client.timeStart) + 'ms ] =====')
            writeFileSync(global.client['configPath'], JSON['stringify'](global.config, null, 4), 'utf8')
            if (existsSync(global.client.configPath + '.temp')) unlinkSync(global['client']['configPath'] + '.temp'); // Added condition to prevent error
            const listenerData = {};
            listenerData.api = loginApiData;
            listenerData.models = botModel;
            const listener = require('./includes/listen')(listenerData);

            function listenerCallback(error, message) {
                if (error) return logger(global.getText('prince', 'handleListenError', JSON.stringify(error)), 'error'); // Changed from priyansh to prince
                if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
                if (global.config.DeveloperMode == !![]) console.log(message);
                return listener(message);
            };
            global.handleListen = loginApiData.listenMqtt(listenerCallback);
            try {
                await checkBan(loginApiData);
            } catch (error) {
                return //process.exit(0);
            };
            if (!global.checkBan) logger(global.getText('prince', 'warningSourceCode'), '[ GLOBAL BAN ]'); // Changed from priyansh to prince
        });
    }

    //========= Connecting to Database =========//

    (async () => {
        try {
            await sequelize.authenticate();
            const authentication = {};
            authentication.Sequelize = Sequelize;
            authentication.sequelize = sequelize;
            const models = require('./includes/database/model')(authentication);
            logger(global.getText('prince', 'successConnectDatabase'), '[ DATABASE ]'); // Changed from priyansh to prince
            const botData = {};
            botData.models = models
            onBot(botData);
        } catch (error) { logger(global.getText('prince', 'successConnectDatabase', JSON.stringify(error)), '[ DATABASE ]'); } // Changed from priyansh to prince
    })();

    process.on('unhandledRejection', (err, p) => {});
}
