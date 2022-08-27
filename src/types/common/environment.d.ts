import { ColorResolvable, Snowflake } from "discord.js";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      DISCORD_TOKEN: string;
      DISCORD_CLIENT_ID: Snowflake;
      DISCORD_GUILD_ID: Snowflake;
      DEVELOPMENT_MODE: boolean;
      ENCRYPTION_ALGORITHM: string;
      ENCRYPTION_SECRET: string;
      EMBED_COLOR_SUCCESS: ColorResolvable;
      EMBED_COLOR_WAIT: ColorResolvable;
      EMBED_COLOR_ERROR: ColorResolvable;
      EMBED_FOOTER_TEXT: string;
      EMBED_FOOTER_ICON: string;
      LOG_LEVEL: string;
      REPUTATION_TIMEOUT: number;
      BOT_HOSTER_NAME: string;
      BOT_HOSTER_URL: string;
    }
  }
}

export {};
