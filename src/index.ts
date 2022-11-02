import { Client, Collection, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'

import { register as commandRegister } from './handlers/command'
import { register as eventRegister } from './handlers/event'
import { start as scheduleStart } from './handlers/schedule'

const main = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  client.commands = new Collection()

  await scheduleStart(client)
  await eventRegister(client)
  await commandRegister(client)

  await client.login(process.env.DISCORD_TOKEN)
}

main()
