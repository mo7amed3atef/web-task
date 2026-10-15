const postRepository = require("../repository/post.repository");

async function getAllPosts(search) {
    return postRepository.getAllPosts(search);
}

async function getPostById(id) {
    return postRepository.getPostById(id);
}

async function createPost(data) {
    return postRepository.createPost(data);
}

async function updatePost(id, userId, data) {
    const post = await postRepository.getPostById(id);

    if (!post || post.user?.id !== userId) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    return postRepository.updatePost(post, data);
}

async function deletePost(id, userId) {
    const post = await postRepository.getPostById(id);

    if (!post || post.user?.id !== userId) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    await postRepository.deletePost(post);
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};