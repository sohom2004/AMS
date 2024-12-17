
import express from "express";
import {
  addOrUpdateAttendance,
  getAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/add", addOrUpdateAttendance);
router.get("/", getAttendance);
router.delete("/:id", deleteAttendance);

export default router;

