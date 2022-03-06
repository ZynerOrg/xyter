const axios = require('axios');

const config = require('../../config.json');

module.exports = axios.create({
  baseURL: config.credits.url,
  headers: { Authorization: `Bearer ${config.credits.token}` },
});
