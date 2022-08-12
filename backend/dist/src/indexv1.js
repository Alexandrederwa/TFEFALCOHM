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
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errors_1 = __importDefault(require("./middlewares/errors"));
const cors_1 = __importDefault(require("cors"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
var bodyParser = require('body-parser');
const auth_1 = __importDefault(require("./routes/auth"));
const product_1 = __importDefault(require("./routes/product"));
const quotes_1 = __importDefault(require("./routes/quotes"));
const data_source_1 = require("./data-source");
const express = require("express");
const path = require('path');
const app = express();
const PORT = 8000;
app.use((0, cookie_parser_1.default)());
app.use(express.static(__dirname + "../../../build/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, cors_1.default)({
        credentials: true,
        origin: "http://localhost:8081",
        optionsSuccessStatus: 200,
    }));
    app.get('*', (res) => {
        return res.sendFile(path
            .join(__dirname + '../../../build/', 'index.html'));
    });
}
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:8081",
    optionsSuccessStatus: 200,
}));
process.on("uncaughtException", (err) => {
    console.log(`Error = ${err.message}`);
    console.log("Shutting down server due to uncaughtException Error");
    process.exit(1);
});
app.use("/api/auth", auth_1.default);
app.use("/api/products", product_1.default);
app.use("/api/quotes", quotes_1.default);
app.use(errors_1.default);
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
//# sourceMappingURL=indexv1.js.map