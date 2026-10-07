import "reflect-metadata";
import { DataSource } from "typeorm";
import { Note } from "./note.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "0000",
    database: "postgres",

    entities: [Note],

});