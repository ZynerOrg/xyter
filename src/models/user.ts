import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";

export interface IUser {
  guildId: Snowflake;
  userId: Snowflake;
  language: string;
  reputation: number;
  credits: number;
  level: number;
  points: number;
  updatedAt: Date;
  createdAt: Date;
}

const userSchema = new Schema(
  {
    guildId: {
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
    language: {
      type: String,
      default: "en",
    },
    reputation: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IUser>("user", userSchema);
