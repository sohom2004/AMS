
import express from "express";
import { addUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-user", addUser);

export default router;
