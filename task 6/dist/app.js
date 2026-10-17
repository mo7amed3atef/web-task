"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("./db");
const note_entity_1 = require("./note.entity");
const typeorm_1 = require("typeorm");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
const noteRepository = () => db_1.AppDataSource.getRepository(note_entity_1.Note);
app.get("/notes", async (req, res) => {
    try {
        const search = req.query.search;
        let notes;
        if (search) {
            notes = await noteRepository().find({
                where: [
                    {
                        title: (0, typeorm_1.ILike)(`%${search}%`),
                    },
                    {
                        content: (0, typeorm_1.ILike)(`%${search}%`),
                    },
                ],
            });
        }
        else {
            notes = await noteRepository().find();
        }
        res.json(notes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});
app.get("/notes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const note = await noteRepository().findOneBy({ id });
        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }
        res.json(note);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});
app.post("/notes", async (req, res) => {
    try {
        const { title, content } = req.body;
        const token = crypto_1.default.randomBytes(16).toString("hex");
        const note = noteRepository().create({
            title,
            content,
            token,
        });
        const result = await noteRepository().save(note);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});
app.put("/notes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, content } = req.body;
        const note = await noteRepository().findOneBy({ id });
        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }
        note.title = title;
        note.content = content;
        const result = await noteRepository().save(note);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});
app.delete("/notes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await noteRepository().delete(id);
        if (result.affected === 0) {
            return res.status(404).json({
                message: "Note not found",
            });
        }
        res.json({
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});
db_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed:", error);
});
