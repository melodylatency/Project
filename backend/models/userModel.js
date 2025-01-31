import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: true,
  },
  isBlocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
});

// password hash compare
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("email")) {
    const userExists = await User.findOne({ email: this.email });
    if (userExists && userExists.isBlocked) {
      throw new Error("This email is blocked.");
    }
  }

  if (!this.isModified("password")) {
    // if the password key is not modified
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
