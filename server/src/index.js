import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server will be listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED!! : ", err);
});