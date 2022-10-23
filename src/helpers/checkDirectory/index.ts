import fs from "fs";
const fsPromises = fs.promises;

export default async (path: string) => {
  const result = await fsPromises.readdir(`${__dirname}/../../${path}`);
  return result;
};
