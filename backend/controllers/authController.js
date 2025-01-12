import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Path to your User model

export const login = async (req, res) => {
  const { role, domain, department, username, password } = req.body;

  try {
    // Construct query based on role
    const query = { role, username };
    if (role === "Staff") query.domain = domain;
    if (role === "HOD") query.department = department;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout function (optional if JWTs are managed client-side)
export const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};
