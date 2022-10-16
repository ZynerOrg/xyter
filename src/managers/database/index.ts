import mongoose from "mongoose";
import logger from "../../middlewares/logger";

// Function to connect to MongoDB server
export const connect = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then((connection) => {
      logger.info(`💾 Connected to database: ${connection.connection.name}`);
    })
    .catch(() => {
      throw new Error("Error connecting to database.");
    });

  mongoose.connection.on("error", () => {
    throw new Error("Failed to connect to database.");
  });

  mongoose.connection.on("warn", (warning) => {
    logger.warn(`💾 ${warning}`);
  });
};
