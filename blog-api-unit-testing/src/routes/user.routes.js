const express = require("express");

const authMiddleware = require("../middlewares/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// GET /user/dashboard
router.get(
    "/dashboard",
    authMiddleware,
    asyncHandler(async (req, res) => {
        return res.json({
            success: true,
            message: "Welcome to User Dashboard",
            user: req.user,
        });
    })
);

module.exports = router;