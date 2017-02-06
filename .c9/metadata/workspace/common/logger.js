{"filter":false,"title":"logger.js","tooltip":"/common/logger.js","undoManager":{"mark":0,"position":0,"stack":[[{"start":{"row":0,"column":0},"end":{"row":47,"column":24},"action":"remove","lines":["var winston = require('winston');","","var config = {","    \"level\": \"debug\",","    \"file\": \"./output.log\"","};","","var logger = new(winston.Logger)({","    level: config.level,","    transports: [","        new(winston.transports.Console)({","            timestamp: true,","            colorize: true,","        }),","        new(winston.transports.File)({","            json: false,","            filename: config.file,","        })","    ],","    exceptionHandlers: [","        new(winston.transports.Console)({","            timestamp: true,","            handleExceptions: true,","            humanReadableUnhandledException: true","        }),","        new(winston.transports.File)({","            json: false,","            timestamp: true,","            handleExceptions: true,","            humanReadableUnhandledException: true,","            filename: config.file","        })","    ],","    exitOnError: false","});","","logger.stream = {","    write: function(message, encoding) {","        logger.info(message.slice(0, -1));","    }","};","","logger.db = function(collectionName, method, query, doc, options) {","    // LOG format: Mongoose: exams.find({ student: ObjectId(\"55633e000cf842a221a37ae3\") }) { sort: { beginDate: 1 }, fields: undefined } ","    logger.debug('Mongoose: %s.%s(%s) %s', collectionName, method, JSON.stringify(query), JSON.stringify(doc));","};","","module.exports = logger;"],"id":2},{"start":{"row":0,"column":0},"end":{"row":43,"column":24},"action":"insert","lines":["var winston = require('winston');","var config = require('nconf');","","var logger = new(winston.Logger)({","    level: config.get('logger:level'),","    transports: [","        new(winston.transports.Console)({","            timestamp: true,","            colorize: true,","        }),","        new(winston.transports.File)({","            json: false,","            filename: config.get('logger:file'),","        })","    ],","    exceptionHandlers: [","        new(winston.transports.Console)({","            timestamp: true,","            handleExceptions: true,","            humanReadableUnhandledException: true","        }),","        new(winston.transports.File)({","            json: false,","            timestamp: true,","            handleExceptions: true,","            humanReadableUnhandledException: true,","            filename: config.get('logger:file')","        })","    ],","    exitOnError: false","});","","logger.stream = {","    write: function(message, encoding) {","        logger.info(message.slice(0, -1));","    }","};","","logger.db = function(collectionName, method, query, doc, options) {","    // LOG format: Mongoose: exams.find({ student: ObjectId(\"55633e000cf842a221a37ae3\") }) { sort: { beginDate: 1 }, fields: undefined } ","    logger.debug('Mongoose: %s.%s(%s) %s', collectionName, method, JSON.stringify(query), JSON.stringify(doc));","};","","module.exports = logger;"]}]]},"ace":{"folds":[],"scrolltop":298,"scrollleft":0,"selection":{"start":{"row":43,"column":24},"end":{"row":43,"column":24},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":17,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1486245396009,"hash":"83cb8c2ff0cbb1d9522145fc1a7745a19b6ce414"}