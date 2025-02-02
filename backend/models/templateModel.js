import { DataTypes } from "sequelize";
import sequelize from "../config/config";

const Template = sequelize.define(
  "Template",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Education", "Quiz", "Poll", "Job Application", "Other"]],
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access: {
      type: DataTypes.ENUM("public", "restricted"),
      allowNull: false,
      defaultValue: "public",
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Template",
    tableName: "templates",
  }
);

Template.associations = (models) => {
  Template.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
};

export default Template;
