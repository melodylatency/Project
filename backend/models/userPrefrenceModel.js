import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class UserPreference extends Model {}

UserPreference.init(
  {
    language: {
      type: DataTypes.ENUM("en", "other"),
      defaultValue: "en",
    },
    theme: {
      type: DataTypes.ENUM("light", "dark"),
      defaultValue: "light",
    },
  },
  {
    sequelize,
    modelName: "UserPreference",
    tableName: "user_preferences",
  }
);

UserPreference.associations = (models) => {
  UserPreference.belongsTo(models.User, { foreignKey: "user_id" });
};

export default UserPreference;
