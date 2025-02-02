import { Sequelize } from "sequelize";
import templates from "../data/templates.js";

export default {
  up: async (queryInterface) => {
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE is_admin = true LIMIT 1;`
    );

    const sampleTemplates = templates.map((template) => ({
      ...template,
      id: Sequelize.literal("uuid_generate_v4()"),
      created_by: adminUser[0].id, // Ensure this matches your DB column
      created_at: new Date(),
      updated_at: new Date(),
    }));

    return queryInterface.bulkInsert("templates", sampleTemplates);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("templates", null, {});
  },
};
