import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import connectDB from "./config/db.js";
import User from "./models/userModel.js";

dotenv.config();

connectDB(); // Connect to MongoDB

const importData = async () => {
  try {
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id; // ID of Admin user

    console.log("All data imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.log("Import failed".purple.inverse);
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log("All data destroyed!".green.inverse);
    process.exit();
  } catch (error) {
    console.log("Destroy aborted".purple.inverse);
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
