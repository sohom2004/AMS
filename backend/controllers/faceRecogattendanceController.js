import Student from "../models/studentmodel.js";
import Attendance from "../models/Attendance.js";

/**
 * Updates attendance when a student's face is successfully recognized.
 * @param {Object} studentData - The student data containing `registrationNumber`, `name`, and `status`.
 * @returns {Object} Response indicating the success or failure of the update.
 */
export const updateAttendance = async (studentData) => {
  try {
    const { registrationNumber, status } = studentData;
    //console.log(registrationNumber);
    //console.log(status);

    if (status !== "matched") {
      return { success: false, message: "Face recognition unsuccessful: unmatched." };
    }
    else if (status === "matched"){
      // Find the student using the registration number
    const student = await Student.findOne({ registrationNumber });
    if (!student) {
      return { success: false, message: "Student not found." };
    }

    // Check if attendance for the current date already exists for the student
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const existingAttendance = await Attendance.findOne({
      user: student._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingAttendance) {
      return { success: false, message: "Attendance for today is already marked." };
    }

    // Create a new attendance record for the student with the current date
    const attendanceRecord = new Attendance({
      user: student._id, // Reference to the student
      registrationNumber: registrationNumber,
      status: "Present", // Marking the student as present
      date: new Date(), // Explicitly set the current date
    });

    // console.log("Student ID:", student._id);
    // console.log("Attendance Data:", {
    //   user: student._id,
    //   status: "Present",
    //   date: new Date(),
    // }); 


    try {
      const finalAttendance = attendanceRecord.save();
      // console.log(finalAttendance);
      return { success: true, message: "Attendance marked successfully for today." };
    } catch (error) {
    console.error("Error updating attendance:", error);
    return { success: false, message: "Error updating attendance." };
  }
    }

    
} catch (error) {
  console.error("Error -> ", error);
}
};
