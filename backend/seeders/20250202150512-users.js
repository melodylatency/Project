import { Sequelize } from "sequelize";
import users from "../data/users.js";
import bcrypt from "bcryptjs";

export default {
  up: async (queryInterface) => {
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        id: Sequelize.literal("uuid_generate_v4()"),
        password: await bcrypt.hash(user.password, 10),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );

    return queryInterface.bulkInsert("users", hashedUsers);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
