// Question Model (questions.js)
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
      type: DataTypes.ENUM(
        "SINGLE_LINE",
        "MULTI_LINE",
        "INTEGER",
        "CHECKBOX",
        "DROPDOWN"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    show_in_results: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: true,
    underscored: true,
  }
);

Question.associations = (models) => {
  Question.belongsTo(models.Template, { foreignKey: "template_id" });
  Question.hasMany(models.Answer, { foreignKey: "question_id" });
  Question.hasMany(models.QuestionOption, { foreignKey: "question_id" });
};

export default Question;
