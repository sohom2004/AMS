import express from "express"
const router = express.Router();
import { addLeaveDetail, updateAttendanceStatus, deleteLeaveDetail, getLeaveDetails, getLeaveDetailsByRegistrationNumber } from "../controllers/leaveDetailController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

// POST: Add leave detail
router.post("/leave", addLeaveDetail);

router.put("/leave", updateAttendanceStatus);

// GET: Fetch all leave details
router.get("/leave", authMiddleware, getLeaveDetails);

router.get("/leave/:registrationNumber", getLeaveDetailsByRegistrationNumber);

// DELETE: Delete a leave detail
router.delete("/leave/:id", deleteLeaveDetail);

export default router;
