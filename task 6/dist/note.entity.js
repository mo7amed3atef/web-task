"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const typeorm_1 = require("typeorm");
exports.Note = new typeorm_1.EntitySchema({
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
        token: {
            type: String,
            nullable: false
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    }
});
