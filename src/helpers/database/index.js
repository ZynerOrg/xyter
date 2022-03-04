const logger = require(`${__basedir}/handlers/logger`);

const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(__config.mongodb.url);
    await logger.info('Connected to the database');
  } catch (err) {
    await logger.error(err);
  }
};
