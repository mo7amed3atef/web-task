import { EntitySchema } from "typeorm";

export interface NoteType {
    id: number;
    title: string;
    content: string;
    token: string;
    created_at: Date;
}

export const Note = new EntitySchema<NoteType>({
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