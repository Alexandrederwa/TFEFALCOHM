import "reflect-metadata";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/errors";
import * as helmet from "helmet";
const bodyParser = require('body-parser');
dotenv.config();
// API ROUTES
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import requestQuotesRoutes from "./routes/quotes";
import { AppDataSource } from "./data-source";
// import { NextFunction } from "express";
const express = require("express");
const path = require('path');
const app = express();
const cors = require('cors');
// const helmet = require("helmet");
// app.use(cors());
app.use(bodyParser.json())
app.use(express.json())
var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//SECURE HEADERS 


//Content-Security-Policy

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'unsafe-inline' ,"https://www.falcohmsystem.be/"],
      imgSrc:[ "'self'", "data:", "https://res.cloudinary.com"],
      connectSrc : ["'self'","https://api.cloudinary.com"],
      upgradeInsecureRequests: [],
    },
  })
);

//X-Content-Type-Options
app.use(helmet.noSniff());

//X-Frame-Options
 app.use(
  helmet.frameguard({
    action: "sameorigin",
  })
 );

//X-XSS-Protection
app.use(helmet.xssFilter());

//Referrer-Policy
app.use(
  helmet.referrerPolicy({
    policy: ["strict-origin-when-cross-origin"]
  })
 );

//X-Powered-By
app.use(helmet.hidePoweredBy());

//Strict-Transport-Security
app.use(
  helmet.hsts({
    maxAge: 63072000, //2 YEARS
    includeSubDomains: true,
    preload: false
  })
);


// MIDDLEWARES
app.use(cookieParser());
app.use(express.static(__dirname + "../../../build/"));
app.use(express.json());

app.use(ErrorMiddleware);


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
  

app.get('*', (res: any) => {
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
