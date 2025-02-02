import dotenv from "dotenv";
import colors from "colors/safe.js"; // Updated import
import users from "./data/users.js";
import templates from "./data/templates.js";
import sequelize from "./config/config.js";
import { User, Template } from "./models/index.js";

dotenv.config();

const importData = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");
    await sequelize.sync({ force: true });
    const createdUsers = await User.bulkCreate(users);

    const adminUser = createdUsers[0].id;

    const sampleTemplates = templates.map((template) => ({
      ...template,
      created_by: adminUser, // Assign the admin user or modify as needed
    }));
    await Template.bulkCreate(sampleTemplates);
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
    await Template.destroy({ where: {} });
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
