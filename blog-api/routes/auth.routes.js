
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AppDataSource = require("../db");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");

const {
    registerSchema,
    loginSchema,
} = require("../validation");

const router = express.Router();

// Register
router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        const userRepository =
            AppDataSource.getRepository("User");

        const existingUser = await userRepository.findOne({
            where: [
                { username },
                { email },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({
            username,
            email,
            password: hashedPassword,
        });

        await userRepository.save(user);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    })
);

// Login
router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const userRepository =
            AppDataSource.getRepository("User");

        const user = await userRepository.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.json({
            message: "Login successful",
            token,
        });
    })
);

module.exports = router;
