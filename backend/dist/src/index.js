"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet = __importStar(require("helmet"));
const bodyParser = require('body-parser');
dotenv_1.default.config();
const auth_1 = __importDefault(require("./routes/auth"));
const product_1 = __importDefault(require("./routes/product"));
const quotes_1 = __importDefault(require("./routes/quotes"));
const data_source_1 = require("./data-source");
const express = require("express");
const path = require('path');
const app = express();
app.use((0, cors_1.default)());
app.use(bodyParser.json());
app.use(express.json());
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use((0, cors_1.default)(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'", 'unsafe-inline', "https://www.falcohmsystem.be/"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "https://api.cloudinary.com"],
        upgradeInsecureRequests: [],
    },
}));
app.use(helmet.noSniff());
app.use(helmet.frameguard({
    action: "sameorigin",
}));
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({
    policy: ["strict-origin-when-cross-origin"]
}));
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({
    maxAge: 63072000,
    includeSubDomains: true,
    preload: false
}));
app.use((0, cookie_parser_1.default)());
app.use(express.static(__dirname + "../../../build/"));
app.use(express.json());
process.on("uncaughtException", (err) => {
    console.log(`Error = ${err.message}`);
    console.log("Shutting down server due to uncaughtException Error");
    process.exit(1);
});
app.use("/api/auth", auth_1.default);
app.use("/api/products", product_1.default);
app.use("/api/quotes", quotes_1.default);
app.use(express.static(__dirname + "../../../build/"));
app.get('/', (res) => {
    return res.sendfile(path
        .join(__dirname + '../../../build/', 'index.html'));
});
const PORT = 4000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize();
        console.log("Database connected!");
        console.log(`Server running at http://localhost:${PORT}`);
    }
    catch (err) {
        console.error("---------------------");
        console.error(err);
        console.error("---------------------");
        process.exit();
    }
}));
//# sourceMappingURL=index.js.map