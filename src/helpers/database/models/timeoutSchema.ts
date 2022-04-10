import mongoose from "mongoose";

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
    timeoutId: { type: mongoose.SchemaTypes.String },
  },
  { timestamps: true }
);

export default mongoose.model("timeout", timeoutSchema);
