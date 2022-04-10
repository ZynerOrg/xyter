import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    guildId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    channelId: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
    word: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      index: true,
    },
    counter: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: false,
      index: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("counter", counterSchema);
