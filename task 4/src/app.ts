import express from "express";
import fs from "fs";
import path from "path";
import { Note } from "./types/note";

const app = express();

app.use(express.json());

const PORT = 3000;

const filePath = path.join(__dirname, "../data/notes.json");

const readNotes = (): Note[] => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

const writeNotes = (notes: Note[]): void => {
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
};

app.get("/notes", (req, res) => {
    const notes = readNotes();

    res.json(notes);
});

app.post("/notes", (req, res) => {
    const notes = readNotes();

    const newNote: Note = {
        id: notes.length + 1,
        title: req.body.title,
        content: req.body.content
    };

    notes.push(newNote);

    writeNotes(notes);

    res.status(201).json(newNote);
});


app.delete("/notes/:id", (req, res) => {
    const notes = readNotes();

    const id = Number(req.params.id);

    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    notes.splice(noteIndex, 1);

    writeNotes(notes);

    res.json({
        message: "Note deleted successfully"
    });
});


app.put("/notes/:id", (req, res) => {
    const notes = readNotes();

    const id = Number(req.params.id);

    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    const updatedNote: Note = {
        id: id,
        title: req.body.title,
        content: req.body.content
    };

    notes[noteIndex] = updatedNote;

    writeNotes(notes);

    res.json(updatedNote);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});