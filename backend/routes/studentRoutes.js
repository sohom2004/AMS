import express from 'express'
import { addStudent, getAllStudents, getStudentByRegistrationNumber, deleteStudentByRegistrationNumber, updateStudentByRegistrationNumber, upload } from '../controllers/studentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, upload.array("images", 5), addStudent);
router.get("/getallstudents", authMiddleware, getAllStudents);
router.get("/:registrationNumber", authMiddleware, getStudentByRegistrationNumber);
router.put("/:registrationNumber", authMiddleware, upload.array("images", 5), updateStudentByRegistrationNumber);
router.delete("/:registrationNumber", authMiddleware, deleteStudentByRegistrationNumber);

export default router;
