import express from "express";
import {
  getTemplateById,
  getTemplates,
} from "../controllers/templateController.js";

const router = express.Router();

router.route("/").get(getTemplates);
router.route("/:id").get(getTemplateById);

export default router;
