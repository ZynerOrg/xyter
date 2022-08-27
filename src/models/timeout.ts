import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";

export interface ITimeout {
  userId: Snowflake;
  guildId: Snowflake;
  cooldown: number;
  timeoutId: string;
  createdAt: Date;
  updatedAt: Date;
}

const timeoutSchema = new Schema<ITimeout>(
  {
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
    cooldown: {
      type: Number,
      required: true,
      unique: false,
      index: true,
    },
    timeoutId: { type: String },
  },
  { timestamps: true }
);

export default model<ITimeout>("timeout", timeoutSchema);
