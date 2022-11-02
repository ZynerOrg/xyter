import { Snowflake } from 'discord.js'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string
      DISCORD_TOKEN: string
      DISCORD_CLIENT_ID: Snowflake
      DISCORD_GUILD_ID: Snowflake
      DEVELOPMENT_MODE: string
      ENCRYPTION_ALGORITHM: string
      ENCRYPTION_SECRET: string
      EMBED_COLOR_SUCCESS: string
      EMBED_COLOR_WAIT: string
      EMBED_COLOR_ERROR: string
      EMBED_FOOTER_TEXT: string
      EMBED_FOOTER_ICON: string
      LOG_LEVEL: string
      REPUTATION_TIMEOUT: string
      BOT_HOSTER_NAME: string
      BOT_HOSTER_URL: string
    }
  }
}

export {}
