import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Like extends Model {}

Like.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    template_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "templates",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Like",
    tableName: "likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "template_id"],
      },
    ],
  }
);

Like.associate = (models) => {
  Like.belongsTo(models.Template, { foreignKey: "template_id" });
  Like.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Like;
