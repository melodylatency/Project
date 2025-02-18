import { readdirSync } from "fs";
import { dirname, basename } from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = {};

// Load all models asynchronously
const modelFiles = readdirSync(__dirname).filter(
  (file) =>
    file !== "index.js" && file.endsWith(".js") && !file.includes(".test.js")
);

// Use Promise.all to ensure all models are imported
await Promise.all(
  modelFiles.map(async (file) => {
    const modelModule = await import(`./${file}`);
    const model = modelModule.default;
    db[model.name] = model;
  })
);

// Configure associations after all models are loaded
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

// Add Sequelize instance and connection check
db.sequelize = sequelize;

// Verify database connection
try {
  await sequelize.authenticate();
  console.log("Database connection established");
} catch (err) {
  console.error("Unable to connect to database:", err);
}

export default db;
