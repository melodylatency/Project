import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Question extends Model {}

Question.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("SINGLE_LINE", "MULTI_LINE", "INTEGER", "CHECKBOX"),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    index: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    show_in_results: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    template_id: {
      type: DataTypes.UUID, // Ensure this matches the type of Template's primary key
      allowNull: false, // A question must belong to a template
      references: {
        model: "templates", // Reference the Template table
        key: "id", // Reference the primary key of Template
      },
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: true,
  }
);

Question.associate = (models) => {
  Question.belongsTo(models.Template, { foreignKey: "template_id" });
  Question.hasMany(models.Answer, { foreignKey: "question_id" });
};

export default Question;
