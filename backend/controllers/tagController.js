import asyncHandler from "../middleware/asyncHandler.js";
import Tag from "../models/tagModel.js";

// @desc    Fetch all tags
// @route   /api/tags
// @access  Public
const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  const suggestions = tags.map(({ id, label }) => ({
    value: id,
    label,
  }));
  suggestions.sort((a, b) => a.label.localeCompare(b.label));
  res.status(200).json(suggestions);
});

export { getTags };
