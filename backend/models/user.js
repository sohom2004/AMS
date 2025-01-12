import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["HOD", "Staff"],
    required: true,
  },
  domain: {
    type: String,
    enum: ["Fullstack", "ML", "Web3", "DS", "Cybersecurity"],
    required: function () {
      return this.role === "Staff";
    },
    default: null,
  },
  department: {
    type: String,
    enum: ["CSE", "ECE", "MECH", "CIVIL", "IT", "AIDS"],
    required: function () {
      return this.role === "HOD";
    },
    default: null,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
