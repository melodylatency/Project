import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Ticket extends Model {}

Ticket.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jiraKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("High", "Average", "Low"),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    template: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "Ticket",
    tableName: "tickets",
    timestamps: true,
    indexes: [
      {
        fields: ["jiraKey"], // For quick lookups when syncing with Jira
      },
    ],
  }
);

Ticket.associate = (models) => {
  Ticket.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Ticket;
