import asyncHandler from "../middleware/asyncHandler.js";
import Template from "../models/templateModel.js";
import Question from "../models/questionModel.js";

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

const createTemplate = asyncHandler(async (req, res) => {
  const { title, description, topic, image, access, authorId, questionList } =
    req.body;

  if (!title || !authorId || !questionList) {
    res.status(400);
    throw new Error("Missing required fields: title, questions, or authorId");
  }

  // Create the Template
  const template = await Template.create({
    title,
    description: description || "",
    topic: topic || "Other",
    image:
      image ||
      "https://img.freepik.com/free-vector/cerulean-blue-curve-frame-template-vector_53876-136094.jpg",
    access: access || "public",
    authorId,
  });

  // Process Questions if provided
  const convertType = (type) => {
    switch (type) {
      case "text":
        return "SINGLE_LINE";
      case "textarea":
        return "MULTI_LINE";
      case "number":
        return "INTEGER";
      case "checkbox":
        return "CHECKBOX";
      default:
        throw new Error(`Invalid question type: ${type}`);
    }
  };

  const questionsData = questionList.map((q, index) => ({
    type: convertType(q.type),
    title: q.title,
    description: q.description || "",
    order: index, // Use array index as order
    show_in_results: q.displayOnTable,
    template_id: template.id,
  }));

  await Question.bulkCreate(questionsData);

  // Fetch the created Questions with their associations
  // const questions = await Question.findAll({
  //   where: { template_id: template.id },
  //   order: [["order", "ASC"]],
  // });

  res.status(201).json({
    ...template.toJSON(),
  });
});

export { getTemplates, getTemplateById, createTemplate };
