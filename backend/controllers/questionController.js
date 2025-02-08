import asyncHandler from "../middleware/asyncHandler.js";
import Question from "../models/questionModel.js";
import Template from "../models/templateModel.js"; // Import the Template model

const getQuestionsByTemplateId = asyncHandler(async (req, res) => {
  const template_id = req.params.id;

  const questions = await Question.findAll({ where: { template_id } });

  if (questions.length === 0) {
    res.status(404);
    throw new Error("No questions found for this template");
  }

  res.status(200).json(questions);
});

const createQuestion = asyncHandler(async (req, res) => {
  const { title, description, type, order, show_in_results, template_id } =
    req.body;

  // Validate that the template exists
  const template = await Template.findByPk(template_id);
  if (!template) {
    res.status(404);
    throw new Error("Template not found");
  }

  // Create the question
  const question = await Question.create({
    title,
    description,
    type,
    order,
    show_in_results,
    template_id, // Associate the question with the template
  });

  res.status(201).json({
    id: question.id,
    title: question.title,
    description: question.description,
    type: question.type,
    order: question.order,
    show_in_results: question.show_in_results,
    template_id: question.template_id,
  });
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByPk(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  await question.destroy();
  res.status(200).json({ message: "Question deleted successfully" });
});

export { getQuestionsByTemplateId, createQuestion, deleteQuestion };
