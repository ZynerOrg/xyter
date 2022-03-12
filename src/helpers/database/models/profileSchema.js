const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    url: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      index: true,
    },
    token: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('profile', profileSchema);
