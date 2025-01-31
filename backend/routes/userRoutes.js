import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

// ROUTE ORDER MATTERS!!!

router.route("/").get(protect, getUsers);

router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

router
  .route("/:id")
  .get(protect, getUserById)
  .delete(protect, deleteUser)
  .put(protect, updateUser);

router.route("/:id/block").put(protect, blockUser);
router.route("/:id/unblock").put(protect, unblockUser);

export default router;
