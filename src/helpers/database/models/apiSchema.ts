import mongoose from "mongoose";

const apiSchema = new mongoose.Schema(
  {
    guildId: {
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
      default: "https://localhost/api/",
    },
    token: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      index: true,
      default: "token",
    },
  },
  { timestamps: true }
);

export default mongoose.model("api", apiSchema);
