const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
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
    level: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: false,
      default: 0,
      index: false,
    },
    points: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: false,
      default: 0,
      index: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('experience', experienceSchema);
