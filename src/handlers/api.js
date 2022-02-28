const axios = require('axios');

module.exports = axios.create({
  baseURL: process.env.API_URL,
  headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
});
