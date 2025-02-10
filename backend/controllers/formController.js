import asyncHandler from "../middleware/asyncHandler.js";
import Form from "../models/formModel.js";
import Answer from "../models/answerModel.js";

// @desc    Create Form
// @route   POST /api/forms/create
// @access  Public
const createForm = asyncHandler(async (req, res) => {
  const { title, user_id, template_id, answerList } = req.body;

  if (!title || !user_id || !answerList) {
    res.status(400);
    throw new Error("Missing required fields: title, answers, or user_id");
  }

  const form = await Form.create({
    title,
    user_id,
    template_id,
  });

  const answersData = answerList.map((a) => ({
    value: a.value,
    question_id: a.questionId,
    form_id: form.id,
  }));

  await Answer.bulkCreate(answersData);

  res.status(201).json({
    ...form.toJSON(),
  });
});

export { createForm };
