import { Snowflake } from "discord.js";

export interface ICreditModule {
  guildId: Snowflake;
  name: string;
  enabled: boolean;
  data: {
    rate: number;
    timeout: number;
    minimumLength: string;
    workRate: number;
    workTimeout: number;
  };
}
