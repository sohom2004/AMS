// backend/controllers/userController.js
import User from "../models/user.js";

export const addUser = async (req, res) => {
  const { role, domain, department, username, password } = req.body;

  try {
    // Check for existing username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = new User({  role,
      ...(role === "Staff" && { domain }), // Include `domain` only for Staff
      ...(role === "HOD" && { department }), // Include `department` only for HOD
      username,
      password, });
    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

