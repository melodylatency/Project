export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("answers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      form_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "forms",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // Add index for form_id for better query performance
    await queryInterface.addIndex("answers", ["form_id"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("answers");
  },
};
