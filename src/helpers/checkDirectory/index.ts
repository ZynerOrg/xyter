import fs from "fs";
const fsPromises = fs.promises;

export default async (path: string) => {
  const result = fsPromises.readdir(path);
  return result;
};
