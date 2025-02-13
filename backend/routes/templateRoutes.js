import express from "express";
import {
  createTemplate,
  createTemplateReview,
  getTemplateById,
  getTemplates,
} from "../controllers/templateController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getTemplates);
router.route("/:id").get(getTemplateById);

router.route("/create").post(protect, createTemplate);
router.route("/:id/reviews").post(protect, createTemplateReview);

export default router;
