
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Post",
    tableName: "posts",

    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },

        title: {
            type: "varchar",
        },

        content: {
            type: "text",
        },

        createdAt: {
            type: "timestamp",
            createDate: true,
        },

        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },

    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            onDelete: "CASCADE",
        },
    },
});
