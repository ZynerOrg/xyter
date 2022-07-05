import mongoose from "mongoose";
import { url } from "../../config/database";

export const connect = async () => {
  await mongoose.connect(url);
};
