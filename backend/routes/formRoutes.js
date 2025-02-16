import express from "express";
import {
  createForm,
  deleteForm,
  getFormById,
  getTemplateForms,
  getUserForms,
} from "../controllers/formController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/template/:id").get(protect, getTemplateForms);
router.route("/create").post(protect, createForm);
router.route("/:id").get(protect, getFormById).delete(protect, deleteForm);
router.route("/").get(protect, getUserForms);

export default router;
