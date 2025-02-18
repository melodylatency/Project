export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("template_tags", {
      tag_id: {
        type: Sequelize.UUID,
        references: { model: "tags", key: "id" },
      },
      template_id: {
        type: Sequelize.UUID,
        references: { model: "templates", key: "id" },
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("template_tags");
  },
};
