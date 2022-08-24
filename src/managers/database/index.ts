import mongoose from "mongoose";
import logger from "../../logger";

export const connect = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(async (connection) => {
      logger.info(`💾 Connected to database: ${connection.connection.name}`);
    })
    .catch(async (e) => {
      logger.error("💾 Could not connect to database", e);
    });

  mongoose.connection.on("error", async (error) => {
    logger.error(`💾 ${error}`);
  });

  mongoose.connection.on("warn", async (warning) => {
    logger.warn(`💾 ${warning}`);
  });
};
