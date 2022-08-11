import "reflect-metadata";

// import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/errors";
import cors from "cors";


// LOADING ENV VARIABLES
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
var bodyParser = require('body-parser');

// API ROUTES
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import requestQuotesRoutes from "./routes/quotes";

import { AppDataSource } from "./data-source";
const express = require("express");
const path = require('path');
const app = express();

// PORT
const PORT = process.env.PORT;

// MIDDLEWARES
app.use(cookieParser());
app.use(express.static(__dirname + "../../../build/"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//dev localhost
console.log('1')
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(
    cors({
      credentials: true,
      origin: "192.168.10.7",
      optionsSuccessStatus: 200,
    })
  );
}
app.use(
  cors({
    credentials: true,
    origin: "192.168.10.7",
    optionsSuccessStatus: 200,
  })
);
//dev prodction on vps
app.get('*', ( res: any) => {
  return res.sendFile(path
    .join(__dirname + '../../../build/', 'index.html'))
});

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
    console.log("2")
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
