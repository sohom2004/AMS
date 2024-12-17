// backend/controllers/userController.js
import User from "../models/User.js";

export const addUser = async (req, res) => {
  
  const { role, domain, department, password } = req.body;

  // Only HOD can add users
  if (req.user.role !== "HOD") return res.status(403).json({ message: "Permission denied" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ role, domain, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
