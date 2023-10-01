import fs from "fs/promises";
import path from "path";
import logger from "./logger";

export default async (filePath: string) => {
  const directoryPath = path.join(process.cwd(), "dist", filePath);

  try {
    const result = await fs.readdir(directoryPath);
    logger.debug({
      message: `Checked directory ${filePath}`,
      directoryPath,
      result,
    });
    return result;
  } catch (error) {
    const errorMessage = `Error checking directory ${filePath}: ${error}`;
    logger.error({ message: errorMessage, error, directoryPath });
    throw new Error(errorMessage);
  }
};
