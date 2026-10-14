
const express = require("express");
const { ILike } = require("typeorm");

const AppDataSource = require("../db");
const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");

const { postSchema } = require("../validation");

const router = express.Router();

// GET all posts + search
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const postRepository = AppDataSource.getRepository("Post");
        const search = req.query.search;

        const where = search
            ? [
                { title: ILike(`%${search}%`) },
                { content: ILike(`%${search}%`) },
            ]
            : {};

        const posts = await postRepository.find({
            where,
            relations: 
            {
                user: true,
            },
            order: { id: "DESC" },
        });

        return res.json(
            posts.map((post) => ({
                id: post.id,
                title: post.title,
                content: post.content,
                author: post.user.username,
                createdAt: post.createdAt,
            }))
        );
    })
);

// GET one post
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid post ID",
            });
        }

        const postRepository = AppDataSource.getRepository("Post");

        const post = await postRepository.findOne({
            where: { id },
            relations: ["user"],
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        return res.json({
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.user.username,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        });
    })
);

// CREATE post
router.post(
    "/",
    authMiddleware,
    validate(postSchema),
    asyncHandler(async (req, res) => {
        const { title, content } = req.body;

        const postRepository = AppDataSource.getRepository("Post");

        const post = postRepository.create({
            title,
            content,
            user: { id: req.user.id },
        });

        await postRepository.save(post);

        return res.status(201).json({
            message: "Post created successfully",
            post: {
                id: post.id,
                title: post.title,
                content: post.content,
            },
        });
    })
);

// UPDATE post
router.put(
    "/:id",
    authMiddleware,
    validate(postSchema),
    asyncHandler(async (req, res) => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid post ID",
            });
        }

        const postRepository = AppDataSource.getRepository("Post");

        const post = await postRepository.findOne({
            where: {
                id,
                user: { id: req.user.id },
            },
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        post.title = req.body.title;
        post.content = req.body.content;

        await postRepository.save(post);

        return res.json({
            message: "Post updated successfully",
            post: {
                id: post.id,
                title: post.title,
                content: post.content,
            },
        });
    })
);

// DELETE post
router.delete(
    "/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid post ID",
            });
        }

        const postRepository = AppDataSource.getRepository("Post");

        const post = await postRepository.findOne({
            where: {
                id,
                user: { id: req.user.id },
            },
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        await postRepository.remove(post);

        return res.json({
            message: "Post deleted successfully",
        });
    })
);

module.exports = router;
