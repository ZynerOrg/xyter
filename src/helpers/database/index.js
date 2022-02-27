const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to the database');
  } catch (e) {
    console.log(e);
  }
};
