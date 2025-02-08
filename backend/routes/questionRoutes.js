import express from "express";
import { getQuestionsByTemplateId } from "../controllers/questionController.js";

const router = express.Router();

router.route("/:id").get(getQuestionsByTemplateId);

export default router;
