const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authRepository = require("../repository/auth.repository");

async function register({ username, email, password }) {
    const existingUser =
        await authRepository.findUserByUsernameOrEmail(
            username,
            email
        );

    if (existingUser) {
        const error = new Error(
            "Username or email already exists"
        );
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
        username,
        email,
        password: hashedPassword,
    });

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    };
}

async function login({ email, password }) {
    const user = await authRepository.findUserByEmail(email);

    if (
        !user ||
        !(await bcrypt.compare(password, user.password))
    ) {
        const error = new Error(
            "Invalid email or password"
        );
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
}

module.exports = {
    register,
    login,
};