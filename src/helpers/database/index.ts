import mongoose from "mongoose";

import * as config from "../../../config.json";
import logger from "../../handlers/logger";

export default async () => {
  await mongoose.connect(config.mongodb.url);
  logger.info("Connected to the database");
};
