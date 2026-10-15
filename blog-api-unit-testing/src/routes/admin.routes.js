const express = require("express");
const AppDataSource = require("../../db");

const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Admin dashboard
router.get(
    "/dashboard",
    authMiddleware,
    authorize("admin"),
    (req, res) => {
        return res.json({
            message: "Welcome to Admin Dashboard",
            user: req.user,
        });
    }
);

// View all users
router.get(
    "/users",
    authMiddleware,
    authorize("admin"),
    asyncHandler(async (req, res) => {
        const userRepository =
            AppDataSource.getRepository("User");

        const users = await userRepository.find({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            },
            order: {
                id: "DESC",
            },
        });

        return res.json(users);
    })
);

// View all posts including their authors
router.get(
    "/posts",
    authMiddleware,
    authorize("admin"),
    asyncHandler(async (req, res) => {
        const postRepository =
            AppDataSource.getRepository("Post");

        const posts = await postRepository.find({
            relations: {
                user: true,
            },
            order: {
                id: "DESC",
            },
        });

        const result = posts.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.user?.username ?? "Unknown",
            createdAt: post.createdAt,
        }));

        return res.json(result);
    })
);

module.exports = router;
