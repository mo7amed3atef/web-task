
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",

    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },

        username: {
            type: "varchar",
            unique: true,
        },

        email: {
            type: "varchar",
            unique: true,
        },

        password: {
            type: "varchar",
        },

        role: {
            type: "varchar",
            default: "user",
        },
    },

    relations: {
        posts: {
            type: "one-to-many",
            target: "Post",
            inverseSide: "user",
        },
    },
});
