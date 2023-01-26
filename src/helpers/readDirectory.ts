import fs from "fs";
import logger from "../middlewares/logger";
const fsPromises = fs.promises;

export default async (path: string) => {
  const directoryPath = `${process.cwd()}/dist/${path}`;

  return await fsPromises.readdir(directoryPath).then((result) => {
    logger.debug({
      message: `Checked directory ${path}`,
      directoryPath,
      result,
    });
    return result;
  });
};
