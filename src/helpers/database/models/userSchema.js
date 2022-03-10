const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: true,
      index: true,
    },
    language: {
      type: mongoose.SchemaTypes.String,
      default: 'en',
    },
    reputation: { type: mongoose.SchemaTypes.Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
