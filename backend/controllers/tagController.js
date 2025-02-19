import asyncHandler from "../middleware/asyncHandler.js";
import Tag from "../models/tagModel.js";

// @desc    Fetch all tags
// @route   /api/tags
// @access  Public
const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.findAll({
    attributes: [["id", "value"], "label"],
    order: [["label", "ASC"]],
  });
  res.status(200).json(tags);
});

// @desc    Fetch tag cloud
// @route   /api/tags/cloud
// @access  Public
const getTagCloud = asyncHandler(async (req, res) => {
  const tags = await Tag.findAll({
    attributes: [["label", "value"], "count"],
    order: [["label", "ASC"]],
  });
  res.status(200).json(tags);
});

export { getTags, getTagCloud };
