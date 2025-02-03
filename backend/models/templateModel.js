import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

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
    underscored: true,
  }
);

Template.associations = (models) => {
  Template.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
  Template.hasMany(models.Question, { foreignKey: "template_id" });
  Template.hasMany(models.Form, { foreignKey: "template_id" });
  Template.hasMany(models.Comment, { foreignKey: "template_id" });
  Template.hasMany(models.Like, { foreignKey: "template_id" });
  Template.belongsToMany(models.User, {
    through: "template_access",
    foreignKey: "template_id",
  });
  Template.belongsToMany(models.Tag, {
    through: "template_tags",
    foreignKey: "template_id",
  });
};

export default Template;
