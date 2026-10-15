const authService = require("./auth.service");
const authRepository = require("../repository/auth.repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../repository/auth.repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "test-secret";
    });

    describe("register", () => {
        test("should register a new user", async () => {
            authRepository.findUserByUsernameOrEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashed-password");

            const savedUser = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                role: "user",
                password: "hashed-password",
            };

            authRepository.createUser.mockResolvedValue(savedUser);

            const result = await authService.register({
                username: "testuser",
                email: "test@example.com",
                password: "Password@123",
            });

            expect(bcrypt.hash).toHaveBeenCalledWith("Password@123", 10);
            expect(authRepository.createUser).toHaveBeenCalledWith({
                username: "testuser",
                email: "test@example.com",
                password: "hashed-password",
            });

            expect(result).toEqual({
                id: 1,
                username: "testuser",
                email: "test@example.com",
                role: "user",
            });
        });

        test("should reject duplicate username or email", async () => {
            authRepository.findUserByUsernameOrEmail.mockResolvedValue({
                id: 1,
                username: "testuser",
                email: "test@example.com",
            });

            await expect(
                authService.register({
                    username: "testuser",
                    email: "test@example.com",
                    password: "Password@123",
                })
            ).rejects.toMatchObject({
                message: "Username or email already exists",
                statusCode: 409,
            });

            expect(authRepository.createUser).not.toHaveBeenCalled();
        });
    });

    describe("login", () => {
        test("should login with valid credentials", async () => {
            authRepository.findUserByEmail.mockResolvedValue({
                id: 1,
                email: "test@example.com",
                password: "hashed-password",
            });

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fake-jwt-token");

            const result = await authService.login({
                email: "test@example.com",
                password: "Password@123",
            });

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "Password@123",
                "hashed-password"
            );

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1, email: "test@example.com" },
                "test-secret",
                { expiresIn: "1d" }
            );

            expect(result).toBe("fake-jwt-token");
        });

        test("should reject an unknown email", async () => {
            authRepository.findUserByEmail.mockResolvedValue(null);

            await expect(
                authService.login({
                    email: "unknown@example.com",
                    password: "Password@123",
                })
            ).rejects.toMatchObject({
                message: "Invalid email or password",
                statusCode: 401,
            });

            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        test("should reject an incorrect password", async () => {
            authRepository.findUserByEmail.mockResolvedValue({
                id: 1,
                email: "test@example.com",
                password: "hashed-password",
            });

            bcrypt.compare.mockResolvedValue(false);

            await expect(
                authService.login({
                    email: "test@example.com",
                    password: "WrongPassword",
                })
            ).rejects.toMatchObject({
                message: "Invalid email or password",
                statusCode: 401,
            });

            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });
});