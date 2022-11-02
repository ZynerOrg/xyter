import { Client } from 'discord.js'

export interface IJob {
  options: {
    schedule: string
  }
  execute: (client: Client) => Promise<void>
}
