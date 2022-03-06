const pino = require('pino');

const config = require('../../config.json');

const logger = pino({ level: config.debug ? 'debug' : 'info' });
module.exports = logger;
