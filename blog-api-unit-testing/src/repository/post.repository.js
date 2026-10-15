const { ILike } = require("typeorm");
const AppDataSource = require("../../db");

const postRepository = AppDataSource.getRepository("Post");

async function getAllPosts(search) {
    const where = search
        ? [
              { title: ILike(`%${search}%`) },
              { content: ILike(`%${search}%`) },
          ]
        : {};

    return postRepository.find({
        where,
        relations: { user: true },
        order: { id: "DESC" },
    });
}

async function getPostById(id) {
    return postRepository.findOne({
        where: { id },
        relations: { user: true },
    });
}

async function createPost(data) {
    const post = postRepository.create(data);
    return postRepository.save(post);
}

async function updatePost(post, data) {
    post.title = data.title;
    post.content = data.content;

    return postRepository.save(post);
}

async function deletePost(post) {
    await postRepository.remove(post);
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};