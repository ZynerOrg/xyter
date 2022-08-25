import logger from "../../middlewares/logger";

export default async (plugin: string) => {
  logger.debug(`Processing metadata for plugin: ${plugin}`);
  const metadata = await import(`../../plugins/${plugin}/metadata`);
  logger.verbose(`Processed metadata for plugin: ${plugin}!`);
  return metadata.default;
};
