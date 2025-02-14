import express from "express";
import {
  createForm,
  getFormById,
  getUsersForms,
} from "../controllers/formController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getUsersForms);
router.route("/:id").get(protect, getFormById);
router.route("/create").post(createForm);

export default router;
