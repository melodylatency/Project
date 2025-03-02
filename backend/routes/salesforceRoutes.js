import express from "express";
import {
  verifySalesforceConfig,
  createSalesforceAccount,
} from "../controllers/salesforceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/verify-config").get(verifySalesforceConfig);
router.route("/create-account").post(protect, createSalesforceAccount);

export default router;
