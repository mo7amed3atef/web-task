const postService = require("./post.service");
const postRepository = require("../repository/post.repository");

jest.mock("../repository/post.repository");

describe("Post Service Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllPosts", () => {
        test("should return all posts", async () => {
            const posts = [
                { id: 1, title: "First Post" },
                { id: 2, title: "Second Post" },
            ];

            postRepository.getAllPosts.mockResolvedValue(posts);

            const result = await postService.getAllPosts();

            expect(result).toEqual(posts);
            expect(postRepository.getAllPosts).toHaveBeenCalledWith(
                undefined
            );
        });

        test("should pass search query to repository", async () => {
            postRepository.getAllPosts.mockResolvedValue([]);

            await postService.getAllPosts("JavaScript");

            expect(postRepository.getAllPosts).toHaveBeenCalledWith(
                "JavaScript"
            );
        });
    });

    describe("getPostById", () => {
        test("should return a post by ID", async () => {
            const post = { id: 1, title: "My Post" };

            postRepository.getPostById.mockResolvedValue(post);

            const result = await postService.getPostById(1);

            expect(result).toEqual(post);
            expect(postRepository.getPostById).toHaveBeenCalledWith(1);
        });
    });

    describe("createPost", () => {
        test("should create a new post", async () => {
            const data = {
                title: "New Post",
                content: "Post content",
                user: { id: 10 },
            };

            const createdPost = { id: 3, ...data };

            postRepository.createPost.mockResolvedValue(createdPost);

            const result = await postService.createPost(data);

            expect(result).toEqual(createdPost);
            expect(postRepository.createPost).toHaveBeenCalledWith(data);
        });
    });

    describe("updatePost", () => {
        test("should update a post owned by the user", async () => {
            const post = {
                id: 1,
                title: "Old Title",
                content: "Old Content",
                user: { id: 10 },
            };

            const data = {
                title: "New Title",
                content: "New Content",
            };

            const updatedPost = { ...post, ...data };

            postRepository.getPostById.mockResolvedValue(post);
            postRepository.updatePost.mockResolvedValue(updatedPost);

            const result = await postService.updatePost(1, 10, data);

            expect(result).toEqual(updatedPost);
            expect(postRepository.getPostById).toHaveBeenCalledWith(1);
            expect(postRepository.updatePost).toHaveBeenCalledWith(
                post,
                data
            );
        });

        test("should throw 404 if the post does not exist", async () => {
            postRepository.getPostById.mockResolvedValue(null);

            await expect(
                postService.updatePost(99, 10, {
                    title: "New Title",
                    content: "New Content",
                })
            ).rejects.toMatchObject({
                message: "Post not found",
                statusCode: 404,
            });

            expect(postRepository.updatePost).not.toHaveBeenCalled();
        });

        test("should reject updating another user's post", async () => {
            const post = {
                id: 1,
                title: "Other User Post",
                user: { id: 20 },
            };

            postRepository.getPostById.mockResolvedValue(post);

            await expect(
                postService.updatePost(1, 10, {
                    title: "Changed",
                    content: "Changed content",
                })
            ).rejects.toMatchObject({
                message: "Post not found",
                statusCode: 404,
            });

            expect(postRepository.updatePost).not.toHaveBeenCalled();
        });
    });

    describe("deletePost", () => {
        test("should delete a post owned by the user", async () => {
            const post = {
                id: 1,
                title: "My Post",
                user: { id: 10 },
            };

            postRepository.getPostById.mockResolvedValue(post);
            postRepository.deletePost.mockResolvedValue(undefined);

            const result = await postService.deletePost(1, 10);

            expect(result).toBeUndefined();
            expect(postRepository.getPostById).toHaveBeenCalledWith(1);
            expect(postRepository.deletePost).toHaveBeenCalledWith(post);
        });

        test("should throw 404 if the post does not exist", async () => {
            postRepository.getPostById.mockResolvedValue(null);

            await expect(
                postService.deletePost(99, 10)
            ).rejects.toMatchObject({
                message: "Post not found",
                statusCode: 404,
            });

            expect(postRepository.deletePost).not.toHaveBeenCalled();
        });

        test("should reject deleting another user's post", async () => {
            const post = {
                id: 1,
                title: "Other User Post",
                user: { id: 20 },
            };

            postRepository.getPostById.mockResolvedValue(post);

            await expect(
                postService.deletePost(1, 10)
            ).rejects.toMatchObject({
                message: "Post not found",
                statusCode: 404,
            });

            expect(postRepository.deletePost).not.toHaveBeenCalled();
        });
    });
});