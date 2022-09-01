import { DataSource } from "typeorm";
import { ItemDetail } from "./entity/itemDetail";
import { Product } from "./entity/Product";
import { ReqQuotes } from "./entity/Quote";
import { User } from "./entity/User";

// Connecting to data
export const AppDataSource = new DataSource({ 
    type: "postgres",
    host: process.env.HOST,
    port: Number(process.env.DBPORT),
    username: process.env.DBUSER, 
    password: process.env.DBPSW,
    database: process.env.DBNAME,
    synchronize: true,
    logging: false,
    entities: [User,Product,ReqQuotes,ItemDetail],
    subscribers: [],
    migrations: [],
})

// export const AppDataSource = new DataSource({ 
//     type: "postgres",
//     host: process.env.HOST||"192.168.10.11",
//     port: Number(process.env.DBPORT)||5432,
//     username: process.env.DBUSER||"userdb", 
//     password: process.env.DBPSW||"xela12899821",
//     database: process.env.DBNAME||"rent_db",
//     synchronize: process.env.NODE_ENV !== "production",
//     logging: process.env.NODE_ENV === "production",
//     entities: [User,Product,ReqQuotes,ItemDetail],
//     subscribers: [],
//     migrations: [],
// })