const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: true,
      index: true,
    },
    guildId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: false,
      default: 0,
      index: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('credit', creditSchema);
