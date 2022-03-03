const pino = require('pino');
const logger = pino({ level: process.env.DEBUG ? 'debug' : 'info' });
module.exports = logger;
