import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
  }
);

Tag.associate = (models) => {
  Tag.belongsToMany(models.Template, {
    through: "template_tags",
    foreignKey: "tag_id",
  });
};

export default Tag;
