const axios = require('axios');

module.exports = axios.create({
  baseURL: __config.credits.url,
  headers: { Authorization: `Bearer ${__config.credits.token}` },
});
