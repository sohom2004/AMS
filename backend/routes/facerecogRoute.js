import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateAttendance } from "../controllers/faceRecogattendanceController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for images

// Route to handle face recognition
router.post("/recognize", upload.single("image"), async (req, res) => {
  try {
    // Get the path of the uploaded image
    console.log("Request received at /recognize");
    console.log("Request Body: ", req.body);
    console.log("Request File: ", req.file);
    const filePath = req.file.path;

    // Send image to Python server
    const pythonServerUrl = "http://127.0.0.1:8000/start";
    const formData = new FormData();
    formData.append("image", fs.createReadStream(filePath));

    const response = await axios.post(pythonServerUrl, formData, {
      headers: formData.getHeaders(),
      timeout: 10000, // Timeout set to 10 seconds
    });

    // Delete the temporary image file after sending
    fs.unlinkSync(filePath);

    // Handle the response from the Python server
    const pythonresponse = response.data;
    if (pythonresponse.status === "matched") {
      // update the attendance based on the recognized student 
      const attendanceupdate = await updateAttendance(pythonresponse);
      if (attendanceupdate.success) {
        return res.status(200).json({ message: attendanceupdate.message });
      } else {
        return res.status(400).json({ message: attendanceupdate.message });
      }
    } else {
      // unmatched face 
      return res.status(201).json({message: "Face not recognized. Attendance not updated. "});
    }

  } catch (error) {
    // delete the temporary image file if an error occurs
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === "ECONNREFUSED") {
      // Handle timeout error
      return res.status(500).json({ message: "Python server took too long to respond" });
    } else if (error.response) {
      // Handle other errors returned by the Python server
      return res.status(error.response.status).json(error.response.data);
    } else { 
      // Handle other errors
      console.error(error);
      return res.status(500).json({ message: "Error Communicating with python server" });
    }

  }
});

export default router;
