"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
// GET - Get all notes
app.get("/notes", async (req, res) => {
    try {
        const result = await db_1.pool.query("SELECT * FROM notes ORDER BY id");
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
// POST - Add new note
app.post("/notes", async (req, res) => {
    try {
        const { title, content } = req.body;
        const result = await db_1.pool.query("INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", [title, content]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
// DELETE - Delete note
app.delete("/notes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await db_1.pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }
        res.json({
            message: "Note deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
// PUT - Update note
app.put("/notes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, content } = req.body;
        const result = await db_1.pool.query(`UPDATE notes
             SET title = $1, content = $2
             WHERE id = $3
             RETURNING *`, [title, content, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
