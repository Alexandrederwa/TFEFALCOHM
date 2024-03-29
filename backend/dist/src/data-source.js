"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const itemDetail_1 = require("./entity/itemDetail");
const Product_1 = require("./entity/Product");
const Quote_1 = require("./entity/Quote");
const User_1 = require("./entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: Number(process.env.DBPORT),
    username: process.env.DBUSER,
    password: process.env.DBPSW,
    database: process.env.DBNAME,
    synchronize: true,
    logging: false,
    entities: [User_1.User, Product_1.Product, Quote_1.ReqQuotes, itemDetail_1.ItemDetail],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map