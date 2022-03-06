const mongoose = require('mongoose');

const config = require('../../../config.json');
const logger = require('../../handlers/logger');

module.exports = async () => {
  try {
    await mongoose.connect(config.mongodb.url);
    await logger.info('Connected to the database');
  } catch (err) {
    await logger.error(err);
  }
};
