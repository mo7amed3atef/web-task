const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        username: {
            type: "varchar",
            length: 100,
            unique: true
        },
        email: {
            type: "varchar",
            length: 150,
            unique: true
        },
        password: {
            type: "varchar",
            length: 255
        }
    },
    relations: {
        notes: {
            type: "one-to-many",
            target: "Note",
            inverseSide: "user"
        }
    }
});