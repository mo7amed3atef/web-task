
const { DataSource } = require("typeorm");

const User = require("./entities/user");
const Post = require("./entities/post");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    synchronize: true,
    logging: false,

    entities: [User, Post],
});

module.exports = AppDataSource;
