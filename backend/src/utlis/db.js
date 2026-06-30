import dotenv from "dotenv"
import pg from "pg"
import {ENV} from "../config/env.js"
dotenv.config();

const db = new pg.Client({
    user: ENV.PG_USER,
    database: ENV.PG_DATABASE,
    port: ENV.PG_PORT,
    password: ENV.PG_PASSWORD,
    host: ENV.PG_HOST
})

db.connect();

db.on("error", (err) => {
    console.error(`Unexpected error on database: ${err}`);
    process.exit(-1);
})

export const query = (text, params) => db.query(text, params);