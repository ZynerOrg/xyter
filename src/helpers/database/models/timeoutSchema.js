const mongoose = require('mongoose');

const timeoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    guildId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    timeoutId: { type: mongoose.SchemaTypes.Number },
  },
  { timestamps: true },
);

module.exports = mongoose.model('timeout', timeoutSchema);
