import express from "express";
import {
  testSalesforceAuth,
  createSalesforceAccount,
} from "../controllers/salesforceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/test-auth").get(testSalesforceAuth);
router.route("/create-account").post(protect, createSalesforceAccount);

export default router;
