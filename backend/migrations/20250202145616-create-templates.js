export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("templates", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      search_vector: {
        type: Sequelize.TSVECTOR,
        allowNull: true,
      },
      access: {
        type: Sequelize.ENUM("public", "restricted"),
        allowNull: false,
        defaultValue: "public",
      },
      authorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
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
    await queryInterface.sequelize.query(`
      CREATE INDEX templates_search_idx ON templates USING GIN(search_vector);
      
      CREATE OR REPLACE FUNCTION templates_search_vector_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER templates_search_vector_update
      BEFORE INSERT OR UPDATE OF title, description ON templates
      FOR EACH ROW EXECUTE PROCEDURE templates_search_vector_trigger();

      -- Initial population of search vectors for existing data
      UPDATE templates SET search_vector = NULL;
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS templates_search_vector_update ON templates;
      DROP FUNCTION IF EXISTS templates_search_vector_trigger;
    `);
    await queryInterface.dropTable("templates");
  },
};
