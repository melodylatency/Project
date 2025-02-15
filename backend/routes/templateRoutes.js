import express from "express";
import {
  createTemplate,
  createTemplateReview,
  deleteTemplate,
  editTemplateById,
  getTemplateById,
  getTemplates,
  getTemplatesByAuthorId,
} from "../controllers/templateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/author").get(protect, getTemplatesByAuthorId);
router.route("/").get(getTemplates);
router
  .route("/:id")
  .get(getTemplateById)
  .delete(protect, deleteTemplate)
  .put(protect, editTemplateById);

router.route("/create").post(protect, createTemplate);
router.route("/:id/reviews").post(protect, createTemplateReview);

export default router;
