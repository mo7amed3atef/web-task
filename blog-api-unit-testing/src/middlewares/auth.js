
const jwt = require("jsonwebtoken");
const AppDataSource = require("../../db");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }

    const userRepository = AppDataSource.getRepository("User");

    const user = await userRepository.findOne({
        where: { id: decoded.id },
    });

    if (!user) {
        return res.status(401).json({
            message: "User no longer exists",
        });
    }

    req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    };

    next();
});

module.exports = authMiddleware;
