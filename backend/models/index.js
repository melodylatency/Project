import User from "./userModel.js";
import Template from "./templateModel.js";

const models = { User, Template };

// Call each model's associate method if it exists
Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associations === "function") {
    models[modelName].associate(models);
  }
});

export default models;
