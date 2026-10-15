const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");

const {
    registerSchema,
    loginSchema,
} = require("../../validation");

const router = express.Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(authController.register)
);

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(authController.login)
);

module.exports = router;