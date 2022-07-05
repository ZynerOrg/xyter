import fs from "fs";
const fsPromises = fs.promises;

export default async (path: string) => {
  return fsPromises.readdir(path);
};
