import { Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";

class User extends Model {
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_admin", // Snake case for PostgreSQL
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_blocked",
    },
    lastLogin: {
      type: DataTypes.DATE,
      field: "last_login",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users", // Explicit table name
    timestamps: true,
    underscored: true, // Convert camelCase to snake_case
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("email")) {
          const existingUser = await User.findOne({
            where: { email: user.email },
            paranoid: false, // Include soft-deleted records if using
          });
          if (existingUser && existingUser.isBlocked) {
            throw new Error("This email is blocked.");
          }
        }

        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
