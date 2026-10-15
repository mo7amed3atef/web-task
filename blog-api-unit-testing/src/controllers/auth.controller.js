const authService = require("../services/auth.service");

async function register(req, res) {
    const user = await authService.register(req.body);

    return res.status(201).json({
        message: "User registered successfully",
        user,
    });
}

async function login(req, res) {
    const token = await authService.login(req.body);

    return res.json({
        message: "Login successful",
        token,
    });
}

module.exports = {
    register,
    login,
};