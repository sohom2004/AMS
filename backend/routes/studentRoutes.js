import express from 'express'
import { addStudent, getAllStudents, getStudentByRegistrationNumber, deleteStudentByRegistrationNumber, updateStudentByRegistrationNumber, upload } from '../controllers/studentController.js';

const router = express.Router();

router.post("/", upload.array("images", 5), addStudent);
router.get("/getallstudents", getAllStudents);
router.get("/:registrationNumber", getStudentByRegistrationNumber);
router.put("/:registrationNumber", upload.array("images", 5), updateStudentByRegistrationNumber);
router.delete("/:registrationNumber", deleteStudentByRegistrationNumber);

export default router;
