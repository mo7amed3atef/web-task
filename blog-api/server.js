
require("dotenv").config();

const express = require("express");
const AppDataSource = require("./db");

const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");
const adminRoutes = require("./routes/admin.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Blog API is running",
    });
});

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/admin", adminRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "Database connection failed:",
            error.message
        );

        process.exit(1);
    });
