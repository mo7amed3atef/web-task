const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Note",
    tableName: "notes",

    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar",
            length: 255
        },
        content: {
            type: "text"
        }
    },

    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            inversedSide: "notes",
            joinColumn: {
                name: "userId"
            },
            nullable: false,
            onDelete: "CASCADE"
        }
    }
});