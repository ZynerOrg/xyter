import logger from "../../middlewares/logger";
import listDir from "../listDir";

export default async (dir: string) => {
  logger.debug("Processing list of plugins...");
  const plugins = await listDir(dir);
  logger.verbose("Processed list of plugins!");

  return plugins || [];
};
