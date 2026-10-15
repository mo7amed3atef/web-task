const express = require("express");

const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const postController = require("../controllers/post.controller");
const { postSchema } = require("../../validation");

const router = express.Router();

// GET all posts + search
router.get(
    "/",
    asyncHandler(postController.getAllPosts)
);

// GET one post
router.get(
    "/:id",
    asyncHandler(postController.getPostById)
);

// CREATE post
router.post(
    "/",
    authMiddleware,
    validate(postSchema),
    asyncHandler(postController.createPost)
);

// UPDATE post
router.put(
    "/:id",
    authMiddleware,
    validate(postSchema),
    asyncHandler(postController.updatePost)
);

// DELETE post
router.delete(
    "/:id",
    authMiddleware,
    asyncHandler(postController.deletePost)
);

module.exports = router;