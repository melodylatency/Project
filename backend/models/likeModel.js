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
  },
  {
    sequelize,
    modelName: "Like",
    tableName: "likes",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "template_id"],
      },
    ],
  }
);

Like.associations = (models) => {
  Like.belongsTo(models.Template, { foreignKey: "template_id" });
  Like.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Like;
