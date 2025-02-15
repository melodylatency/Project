import express from "express";
import {
  editQuestionById,
  getQuestionById,
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/:id").get(getQuestionById).put(protect, editQuestionById);

export default router;
