import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";
import listingRouter from "./src/routes/listing.route.js";
import path from "path";

import cookieParser from "cookie-parser";

const __dirname = path.resolve();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(cookieParser());

// routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, 'client','dist','index.html'));
})

// middleware for checking errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export { app };
