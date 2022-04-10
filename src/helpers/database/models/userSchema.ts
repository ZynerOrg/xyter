import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    guildId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    userId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    language: {
      type: mongoose.SchemaTypes.String,
      default: "en",
    },
    reputation: { type: mongoose.SchemaTypes.Number, default: 0 },
    credits: { type: mongoose.SchemaTypes.Number, default: 0 },
    levels: { type: mongoose.SchemaTypes.Number, default: 0 },
    points: { type: mongoose.SchemaTypes.Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
