import express from "express";
import {
  addOrUpdateAttendance,
  getAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addOrUpdateAttendance);
router.get("/", authMiddleware, getAttendance);
router.delete("/:id",authMiddleware, deleteAttendance);

export default router;

