import express from "express";
import { createForm } from "../controllers/formController.js";

const router = express.Router();

router.route("/create").post(createForm);

export default router;
