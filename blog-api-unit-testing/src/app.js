const express = require("express");

const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

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
app.use("/user", userRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;