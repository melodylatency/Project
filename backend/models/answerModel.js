import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Answer extends Model {}

Answer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Answer",
    tableName: "answers",
    timestamps: true,
  }
);

Answer.associations = (models) => {
  Answer.belongsTo(models.Form, { foreignKey: "form_id" });
  Answer.belongsTo(models.Question, { foreignKey: "question_id" });
};

export default Answer;
