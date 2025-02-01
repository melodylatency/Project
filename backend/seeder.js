import dotenv from "dotenv";
import colors from "colors/safe.js"; // Updated import
import users from "./data/users.js";
import sequelize from "./config/db.js";
import User from "./models/userModel.js";

dotenv.config();

const importData = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");
    await sequelize.sync({ force: true });
    const createdUsers = await User.bulkCreate(users);

    const adminUser = createdUsers[0].id;

    console.log(colors.green.inverse("All data imported!"));
    process.exit();
  } catch (error) {
    console.log(colors.yellow.inverse("Import failed"));
    console.log(colors.red.inverse(`${error}`));
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.destroy({ where: {} });
    console.log(colors.green.inverse("All data destroyed!"));
    process.exit();
  } catch (error) {
    console.log(colors.yellow.inverse("Destroy aborted"));
    console.log(colors.red.inverse(`${error}`));
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
