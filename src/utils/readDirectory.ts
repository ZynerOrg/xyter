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
    logger.error({
      message: `Error checking directory ${filePath}`,
      error,
      directoryPath,
    });
    throw new Error(`Error checking directory ${filePath}: ${error}`);
  }
};
