import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

export { app };