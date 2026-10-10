require("dotenv").config();

const express = require("express");
const { ILike } = require("typeorm");
const { AppDataSource } = require("./db");
const authMiddleware = require("./auth");
const authRoutes = require("./auth.routes");

const app = express();

app.use(express.json());

// Authentication routes
app.use("/auth", authRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");

        const noteRepository = AppDataSource.getRepository("Note");

        // 1. GET ALL NOTES - Current user only
        app.get("/notes", authMiddleware, async (req, res) => {
            try {
                const notes = await noteRepository.find({
                    where: {
                        user: { id: req.user.userId }
                    }
                });

                return res.status(200).json({
                    message: "Notes retrieved successfully",
                    data: notes
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });

        // 2. CREATE NOTE - Link note to current user
        app.post("/notes", authMiddleware, async (req, res) => {
            try {
                const { title, content } = req.body;

                if (
                    typeof title !== "string" ||
                    typeof content !== "string" ||
                    !title.trim() ||
                    !content.trim()
                ) {
                    return res.status(400).json({
                        message: "Title and content are required"
                    });
                }

                const newNote = noteRepository.create({
                    title: title.trim(),
                    content: content.trim(),
                    user: {
                        id: req.user.userId
                    }
                });

                const savedNote = await noteRepository.save(newNote);

                return res.status(201).json({
                    message: "Note created successfully",
                    data: savedNote
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });

        // 3. SEARCH NOTES - Current user's notes only
        // Must be before /notes/:id
        app.get("/notes/search", authMiddleware, async (req, res) => {
            try {
                const search = req.query.search;

                if (
                    typeof search !== "string" ||
                    !search.trim()
                ) {
                    return res.status(400).json({
                        message: "Search query is required"
                    });
                }

                const keyword = search.trim();

                const notes = await noteRepository.find({
                    where: [
                        {
                            user: { id: req.user.userId },
                            title: ILike(`%${keyword}%`)
                        },
                        {
                            user: { id: req.user.userId },
                            content: ILike(`%${keyword}%`)
                        }
                    ]
                });

                return res.status(200).json({
                    message: "Search completed successfully",
                    data: notes
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });

        // 4. GET NOTE BY ID - Current user only
        app.get("/notes/:id", authMiddleware, async (req, res) => {
            try {
                const id = Number(req.params.id);

                if (!Number.isInteger(id) || id <= 0) {
                    return res.status(400).json({
                        message: "Invalid note ID"
                    });
                }

                const note = await noteRepository.findOne({
                    where: {
                        id,
                        user: { id: req.user.userId }
                    }
                });

                if (!note) {
                    return res.status(404).json({
                        message: "Note not found"
                    });
                }

                return res.status(200).json({
                    message: "Note retrieved successfully",
                    data: note
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });

        // 5. PUT - Update title and content
        app.put("/notes/:id", authMiddleware, async (req, res) => {
            try {
                const id = Number(req.params.id);
                const { title, content } = req.body;

                if (!Number.isInteger(id) || id <= 0) {
                    return res.status(400).json({
                        message: "Invalid note ID"
                    });
                }

                if (
                    typeof title !== "string" ||
                    typeof content !== "string" ||
                    !title.trim() ||
                    !content.trim()
                ) {
                    return res.status(400).json({
                        message: "Title and content are required"
                    });
                }

                const note = await noteRepository.findOne({
                    where: {
                        id,
                        user: { id: req.user.userId }
                    }
                });

                if (!note) {
                    return res.status(404).json({
                        message: "Note not found"
                    });
                }

                note.title = title.trim();
                note.content = content.trim();

                const updatedNote = await noteRepository.save(note);

                return res.status(200).json({
                    message: "Note updated successfully",
                    data: updatedNote
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });

        // 6. PATCH - Update title or content, or both
        app.patch("/notes/:id", authMiddleware, async (req, res) => {
            try {
                const id = Number(req.params.id);
                const { title, content } = req.body;

                if (!Number.isInteger(id) || id <= 0) {
                    return res.status(400).json({
                        message: "Invalid note ID"
                    });
                }

                if (
                    title === undefined &&
                    content === undefined
                ) {
                    return res.status(400).json({
                        message: "Provide title or content to update"
                    });
                }

                if (
                    (title !== undefined &&
                        (typeof title !== "string" || !title.trim())) ||
                    (content !== undefined &&
                        (typeof content !== "string" || !content.trim()))
                ) {
                    return res.status(400).json({
                        message: "Title and content must be non-empty strings"
                    });
                }

                const note = await noteRepository.findOne({
                    where: {
                        id,
                        user: { id: req.user.userId }
                    }
                });

                if (!note) {
                    return res.status(404).json({
                        message: "Note not found"
                    });
                }

                if (title !== undefined) {
                    note.title = title.trim();
                }

                if (content !== undefined) {
                    note.content = content.trim();
                }

                const updatedNote = await noteRepository.save(note);

                return res.status(200).json({
                    message: "Note updated successfully",
                    data: updatedNote
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });

        // 7. DELETE NOTE - Current user only
        app.delete("/notes/:id", authMiddleware, async (req, res) => {
            try {
                const id = Number(req.params.id);

                if (!Number.isInteger(id) || id <= 0) {
                    return res.status(400).json({
                        message: "Invalid note ID"
                    });
                }

                const note = await noteRepository.findOne({
                    where: {
                        id,
                        user: { id: req.user.userId }
                    }
                });

                if (!note) {
                    return res.status(404).json({
                        message: "Note not found"
                    });
                }

                await noteRepository.remove(note);

                return res.status(200).json({
                    message: "Note deleted successfully"
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });

        // START SERVER
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });