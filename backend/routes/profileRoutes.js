
import express from "express";
import { getProfile } from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /profile - Get logged-in user's profile
router.get("/", authMiddleware, getProfile);

export default router;
