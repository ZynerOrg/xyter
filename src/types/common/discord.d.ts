import { Collection } from 'discord.js'
import ICommand from '../../interfaces/Command'

declare module 'discord.js' {
  export interface Client extends DJSClient {
    commands: Collection<string, ICommand>
  }
}

export { Client }
