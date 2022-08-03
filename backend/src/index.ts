import "reflect-metadata";

import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/errors";
import cors from "cors";

// LOADING ENV VARIABLES
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// API ROUTES
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import requestQuotesRoutes from "./routes/quotes";

import { AppDataSource } from "./data-source";

const app = express();

// PORT
const PORT = process.env.PORT;

// MIDDLEWARES
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
      optionsSuccessStatus: 200,
    })
  );
}
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

// TERMINATING SERVER ON INTERNAL ERROR
process.on("uncaughtException", (err: any) => {
  console.log(`Error = ${err.message}`);
  console.log("Shutting down server due to uncaughtException Error");

  process.exit(1);
});

// ROUTES MIDDLEWARE
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotes", requestQuotesRoutes);
// ERROR MIDDLEWARE
app.use(ErrorMiddleware);
  
// LISTENING TO THE PORT
app.listen(PORT, async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected!");
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("---------------------");
    console.error(err);
    console.error("---------------------");

    process.exit();
  }
});
