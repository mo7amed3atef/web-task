
const { z } = require("zod");

const registerSchema = z.object({
    username: z.string()
        .trim()
        .min(3, "Username must be at least 3 characters"),

    email: z.string()
        .trim()
        .email("Invalid email address"),

    password: z.string()
        .min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
    email: z.string()
        .trim()
        .email("Invalid email address"),

    password: z.string()
        .min(1, "Password is required"),
});

const postSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Title is required"),

    content: z.string()
        .trim()
        .min(1, "Content is required"),
});

module.exports = {
    registerSchema,
    loginSchema,
    postSchema,
};
