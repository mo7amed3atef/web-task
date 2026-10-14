
require("dotenv").config();

const AppDataSource = require("./db");

async function makeAdmin() {
    try {
        await AppDataSource.initialize();

        const userRepository =
            AppDataSource.getRepository("User");

        const user = await userRepository.findOne({
            where: { email: "ahmed@example.com" },
        });

        if (!user) {
            console.log("User not found");
            return;
        }

        user.role = "admin";

        await userRepository.save(user);

        console.log("User is now an admin");
    } catch (error) {
        console.error(error.message);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

makeAdmin();
