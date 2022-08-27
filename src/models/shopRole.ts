import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";

export interface IShopRole {
  roleId: Snowflake;
  userId: Snowflake;
  guildId: Snowflake;
  pricePerHour: number;
  lastPayed: Date;
}

const shopRoleSchema = new Schema<IShopRole>(
  {
    roleId: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    guildId: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
      unique: false,
      index: true,
      default: 5,
    },
    lastPayed: {
      type: Date,
      unique: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default model<IShopRole>("shopRole", shopRoleSchema);
