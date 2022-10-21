import fs from "fs";
const fsPromises = fs.promises;

export default async (path: string) => {
  const result = await fsPromises.readdir(path);
  return result;
};
