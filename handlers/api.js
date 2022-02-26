const axios = require('axios');
const { api } = require('../config.json');

module.exports = axios.create({
  baseURL: api.url,
  headers: { Authorization: `Bearer ${api.token}` },
});
