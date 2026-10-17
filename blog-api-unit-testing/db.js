
const { DataSource } = require("typeorm");

const User = require("./src/entities/user");
const Post = require("./src/entities/post");

const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: true,
    logging: false,
    entities: [User, Post],
});

module.exports = AppDataSource;
