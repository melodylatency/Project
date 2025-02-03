import asyncHandler from "../middleware/asyncHandler.js";
import Template from "../models/templateModel.js";

// @desc    Fetch all templates
// @route   /api/templates
// @access  Public
const getTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.findAll({});
  res.json(templates);
});

// @desc    Fetch template by template ID
// @route   /api/templates/:id
// @access  Public
const getTemplateById = asyncHandler(async (req, res) => {
  const template = await Template.findByPk(req.params.id);

  if (template) {
    return res.json(template);
  }

  res.status(404);
  throw new Error("Template not found");
});

export { getTemplates, getTemplateById };
