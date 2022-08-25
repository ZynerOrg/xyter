import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import logger from "../../middlewares/logger";

export default async (builder: any) => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID,
      process.env.DISCORD_GUILD_ID
    ),
    { body: builder }
  );

  await rest
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
      body: builder,
    })
    .then(() => logger.info("Successfully deployed to Discord"))
    .catch(() => logger.error("Failed to deployed to Discord"));
};
