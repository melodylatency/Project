import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
    timestamps: true,
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.Template, { foreignKey: "template_id" });
  Comment.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Comment;
