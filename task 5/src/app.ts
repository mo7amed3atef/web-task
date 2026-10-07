import express from "express";
import { pool } from "./db";

const app = express();

app.use(express.json());

const PORT = 3000;


// GET - Get all notes
app.get("/notes", async (req, res) => {
    try {
        const search = req.query.search as string;

        if (search) {
            const result = await pool.query(
                `SELECT * FROM notes
                 WHERE title ILIKE $1
                 OR content ILIKE $1
                 ORDER BY id`,
                [`%${search}%`]
            );

            return res.json(result.rows);
        }

        const result = await pool.query(
            "SELECT * FROM notes ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {
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

        const result = await pool.query(
            "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
            [title, content]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
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

        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json({
            message: "Note deleted successfully"
        });

    } catch (error) {
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

        const result = await pool.query(
            `UPDATE notes
             SET title = $1, content = $2
             WHERE id = $3
             RETURNING *`,
            [title, content, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});