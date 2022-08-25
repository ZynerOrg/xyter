import logger from "../../middlewares/logger";

export default async (plugin: string, command: string) => {
  logger.debug(`Processing builder for command: ${command}`);
  const { builder } = await import(
    `../../plugins/${plugin}/commands/${command}`
  );
  logger.verbose(`Processed builder for command: ${command}!`);

  return builder;
};
