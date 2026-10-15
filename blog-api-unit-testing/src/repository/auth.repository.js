const AppDataSource = require("../../db");

const userRepository = AppDataSource.getRepository("User");

async function findUserByUsernameOrEmail(username, email) {
    return userRepository.findOne({
        where: [{ username }, { email }],
    });
}

async function findUserByEmail(email) {
    return userRepository.findOne({
        where: { email },
    });
}

async function createUser(data) {
    const user = userRepository.create(data);
    return userRepository.save(user);
}

module.exports = {
    findUserByUsernameOrEmail,
    findUserByEmail,
    createUser,
};