import asyncHandler from "../middleware/asyncHandler.js";
import Form from "../models/formModel.js";
import Answer from "../models/answerModel.js";

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

export { createForm };
