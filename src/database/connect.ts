import { connect } from "mongoose";

import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

/**
 * Instantiates the database connection.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGO_URI;
    if (!dbUri) {
      logHandler.log("error", "missing DB connection string.");
      return;
    }

    await connect(dbUri);

    logHandler.log("debug", "database connected!");

    return;
  } catch (error) {
    errorHandler("database connection", error);
  }
};
