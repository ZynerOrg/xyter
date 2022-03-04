const pino = require('pino');
const logger = pino({ level: __config.debug ? 'debug' : 'info' });
module.exports = logger;
