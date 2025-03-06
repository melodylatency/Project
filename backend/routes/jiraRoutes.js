import express from "express";
import {
  createJiraTicket,
  getUserTickets,
} from "../controllers/jiraControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/tickets")
  .post(protect, createJiraTicket)
  .get(protect, getUserTickets);

export default router;
