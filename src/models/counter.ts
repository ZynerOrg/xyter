import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";

export interface ICounter {
  guildId: Snowflake;
  channelId: Snowflake;
  word: string;
  counter: number;
}

const counterSchema = new Schema<ICounter>(
  {
    guildId: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    channelId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    word: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    counter: {
      type: Number,
      required: true,
      unique: false,
      index: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model<ICounter>("counter", counterSchema);
