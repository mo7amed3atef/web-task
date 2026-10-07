import express from "express";
import { AppDataSource } from "./db";
import { Note } from "./note.entity";
import { ILike } from "typeorm";

const app = express();

app.use(express.json());

const PORT = 3000;

const noteRepository = () => AppDataSource.getRepository(Note);

// GET - Get all notes + Search
app.get("/notes", async (req, res) => {
    try {
        const search = req.query.search as string;

        let notes;

        if (search) {
            notes = await noteRepository().find({
                where: [
                    {
                        title: ILike(`%${search}%`),
                    },
                    {
                        content: ILike(`%${search}%`),
                    },
                ],
            });
        } else {
            notes = await noteRepository().find();
        }

        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// GET - Get note by ID
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
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// POST - Create note
app.post("/notes", async (req, res) => {
    try {
        const { title, content } = req.body;

        const note = noteRepository().create({
            title,
            content,
        });

        const result = await noteRepository().save(note);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// PUT - Update note
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
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// DELETE - Delete note
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
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// Connect to database
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });