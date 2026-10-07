import { EntitySchema } from "typeorm";

export const Note = new EntitySchema({
    name: "Note",
    tableName: "notes",

    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },

        title: {
            type: String,
            nullable: false
        },

        content: {
            type: String,
            nullable: false
        },

        created_at: {
            type: "timestamp",
            createDate: true
        }
    }
});