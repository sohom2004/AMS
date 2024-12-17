
import express from "express";
import { addUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /users - Add a new user (only accessible to HODs)
router.post("/", authMiddleware, addUser);

export default router;
