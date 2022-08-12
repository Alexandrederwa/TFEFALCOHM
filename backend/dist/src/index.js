"use strict";
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
app.get('*', (res) => {
    return res.sendFile(path
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