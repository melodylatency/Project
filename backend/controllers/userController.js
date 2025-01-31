import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

// @desc    Auth user and get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.isBlocked) {
      res.status(403);
      throw new Error("Your account is blocked");
    }

    user.lastLogin = new Date();
    await user.save();

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      lastLogin: user.lastLogin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const lastLogin = new Date();

  const user = await User.create({
    name,
    email,
    password,
    lastLogin,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      lastLogin: user.lastLogin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user and clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("operation", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "logged out successfully" });
});

// Admin section

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Get specific user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Block specific user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (req.user.isBlocked === true) {
    res.status(403);
    throw new Error("You have been blocked");
  }

  if (user) {
    // Set the user as blocked
    user.isBlocked = true;
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Block specific user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (req.user.isBlocked === true) {
    res.status(403);
    throw new Error("You have been blocked");
  }

  if (user) {
    // Set the user as blocked
    user.isBlocked = false;
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete specific user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (req.user.isBlocked === true) {
    res.status(403);
    throw new Error("You have been blocked");
  }

  if (req.user._id === req.params.id) {
    res.status(204);
    throw new Error("You have been deleted");
  }

  if (user) {
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update specific user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.name || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  updateUser,
};
