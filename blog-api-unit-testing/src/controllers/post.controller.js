const postService = require("../services/post.service");

function validatePostId(value) {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Invalid post ID");
        error.statusCode = 400;
        throw error;
    }

    return id;
}

async function getAllPosts(req, res) {
    const posts = await postService.getAllPosts(req.query.search);

    return res.json(
        posts.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.user?.username ?? "Unknown",
            createdAt: post.createdAt,
        }))
    );
}

async function getPostById(req, res) {
    const id = validatePostId(req.params.id);
    const post = await postService.getPostById(id);

    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    return res.json({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.user?.username ?? "Unknown",
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    });
}

async function createPost(req, res) {
    const { title, content } = req.body;

    const post = await postService.createPost({
        title,
        content,
        user: { id: req.user.id },
    });

    return res.status(201).json({
        message: "Post created successfully",
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
        },
    });
}

async function updatePost(req, res) {
    const id = validatePostId(req.params.id);

    const post = await postService.updatePost(
        id,
        req.user.id,
        req.body
    );

    return res.json({
        message: "Post updated successfully",
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
        },
    });
}

async function deletePost(req, res) {
    const id = validatePostId(req.params.id);

    await postService.deletePost(id, req.user.id);

    return res.json({
        message: "Post deleted successfully",
    });
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};