import logger from "../../middlewares/logger";

export default async (plugin: string, command: string) => {
  logger.debug(`Processing options for command: ${command}`);
  const { options } =
    (await import(`../../plugins/${plugin}/commands/${command}`)) || [];
  logger.verbose(`Processed options for command: ${command}!`);

  return options;
};
