import mongoose from "mongoose";

const shopRoleSchema = new mongoose.Schema(
  {
    roleId: {
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
    guildId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    pricePerHour: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: false,
      index: true,
      default: 5,
    },
    lastPayed: {
      type: mongoose.SchemaTypes.Date,
      unique: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("shopRole", shopRoleSchema);
