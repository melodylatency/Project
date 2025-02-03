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
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users", // Explicit table name
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("email")) {
          const existingUser = await User.findOne({
            where: { email: user.email },
            paranoid: false, // Include soft-deleted records if using
          });
          if (existingUser && existingUser.is_blocked) {
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

User.associations = (models) => {
  User.hasMany(models.Template, { foreignKey: "created_by", as: "templates" });
  User.hasMany(models.Form, { foreignKey: "user_id" });
  User.hasMany(models.Comment, { foreignKey: "user_id" });
  User.hasMany(models.Like, { foreignKey: "user_id" });
  User.belongsToMany(models.Template, {
    through: "template_access",
    foreignKey: "user_id",
  });
  User.hasOne(models.UserPreference, { foreignKey: "user_id" });
};

export default User;
