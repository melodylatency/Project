import asyncHandler from "../middleware/asyncHandler.js";
import Form from "../models/formModel.js";
import Question from "../models/questionModel.js";
import Answer from "../models/answerModel.js";

// @desc    Fetch all forms of the user
// @route   /api/forms
// @access  Private
const getUserForms = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const forms = await Form.findAll({});
    res.status(200).json(forms);
  } else {
    const forms = await Form.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(forms);
  }
});

// @desc    Fetch all forms of the template
// @route   /api/forms
// @access  Public
const getTemplateForms = asyncHandler(async (req, res) => {
  const templateId = req.params.id;
  const forms = await Form.findAll({ where: { template_id: templateId } });
  res.status(200).json(forms);
});

// @desc    Fetch form by form ID
// @route   /api/forms/:id
// @access  Public
const getFormById = asyncHandler(async (req, res) => {
  const form_id = req.params.id;

  const form = await Form.findByPk(form_id);
  if (!form) {
    res.status(404);
    throw new Error("Form not found");
  }
  const questions = await Question.findAll({
    where: { template_id: form.template_id },
  });
  const answers = await Answer.findAll({
    where: { form_id },
  });

  const collectedForm = {
    ...form.toJSON(),
    questionList: questions,
    answerList: answers,
  };
  res.status(200).json(collectedForm);
});

// @desc    Create Form
// @route   POST /api/forms/create
// @access  Public
const createForm = asyncHandler(async (req, res) => {
  const { title, user_id, template_id, answerMap } = req.body;

  if (!title || !user_id || !answerMap) {
    res.status(400);
    throw new Error("Missing required fields: title, answers, or user_id");
  }

  const form = await Form.create({
    title,
    user_id,
    template_id,
  });

  const answersData = answerMap.map(({ questionId, value }) => {
    let processedValue;

    if (typeof value === "boolean") {
      processedValue = value;
    } else if (typeof value === "number" && value >= 0) {
      processedValue = Number(value);
    } else {
      processedValue = String(value);
    }

    return {
      question_id: questionId,
      value: processedValue,
      form_id: form.id,
    };
  });

  // Bulk create answers
  await Answer.bulkCreate(answersData);

  res.status(201).json({
    id: form.id,
    title: form.title,
    createdAt: form.createdAt,
  });
});

// @desc    Delete form
// @route   DELETE /api/forms/:id
// @access  Private/Admin
const deleteForm = asyncHandler(async (req, res) => {
  const form = await Form.findByPk(req.params.id);

  if (!form) {
    res.status(404);
    throw new Error("Form not found");
  }

  await form.destroy();
  res.status(200).json({ message: "Form deleted successfully" });
});

export { getUserForms, getTemplateForms, getFormById, createForm, deleteForm };
