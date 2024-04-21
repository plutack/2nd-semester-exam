import { connect } from "./database/connection.js";
import app from "./index.js";
import logger from "./middleware/loggerMiddleware.js";
import { userSeeder } from "./seeder/adminSeeder.js";

const port = process.env.PORT;
const uri = process.env.MONGODB_URI;
connect(uri)
  .then(() => {
    logger.info("database successfully connected");
    userSeeder();
    app.listen(port, () => logger.info(`Server running on port: ${port}`));
  })
  .catch((error) => {
    logger.error("Error connecting to the database:", error);
  });