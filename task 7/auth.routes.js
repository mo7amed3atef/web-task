const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("./db");

const router = express.Router();

const getUserRepository = () => {
    return AppDataSource.getRepository("User");
};

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const userRepository = getUserRepository();

        const existingUser = await userRepository.findOne({
            where: [
                { username: username.trim() },
                { email: email.trim().toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        const savedUser = await userRepository.save(user);

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email
            }
        });
    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const userRepository = getUserRepository();

        const user = await userRepository.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from .env");
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;