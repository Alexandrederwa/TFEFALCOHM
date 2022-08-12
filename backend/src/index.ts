import "reflect-metadata";

// import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/errors";
import cors from "cors";


const bodyParser = require('body-parser');

// API ROUTES
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import requestQuotesRoutes from "./routes/quotes";

import { AppDataSource } from "./data-source";
const express = require("express");
const path = require('path');
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




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
app.use(express.static(__dirname + "../../../build/"));
  

app.get('*', ( res: any) => {
  return res.sendFile(path
    .join(__dirname + '../../../build/', 'index.html'))
});
// LISTENING TO THE PORT
const PORT= 4000; 
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
