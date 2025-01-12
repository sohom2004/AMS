import Attendance from "../models/Attendance.js";
import LeaveDetail from "../models/leaveDetail.js";

// Add or Update Attendance
export const addOrUpdateAttendance = async (req, res) => {
  const { registrationNumber, date, status } = req.body;

  try {
    // Check if attendance already exists for the registrationNumber and date
    const existingAttendance = await Attendance.findOne({
      registrationNumber,
      date: new Date(date).toISOString().slice(0, 10), // Match date to day granularity
    });

    if (existingAttendance) {
      // Update existing attendance
      alert("Attendance already marked for this date");
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.status(200).json({ message: "Attendance updated successfully" });
    }

    // Create new attendance
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
    res.status(201).json({ message: "Attendance added successfully" });
  } catch (error) {
    console.error("Error adding/updating attendance:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch Attendance Records
export const getAttendance = async (req, res) => {
  const { registrationNumber } = req.query;
  const role = req.user.role; // Get role from authenticated user
  const userDomain = req.user.domain; // Get domain from authenticated user
  const userDepartment = req.user.department; // Get department from authenticated user

  try {
    let filter = {};

    if (registrationNumber) {
      filter.registrationNumber = registrationNumber;
    } else if (role === "HOD") {
      filter.department = userDepartment; // Restrict HOD to their department
    } else if (role === "Staff") {
      filter.domain = userDomain; // Restrict Staff to their domain
    }

    const attendanceRecords = await Attendance.find(filter);
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete Attendance Record
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the attendance record by ID
    const attendanceRecord = await Attendance.findById(id);
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found!" });
    }

    // Extract registrationNumber, date, and status
    const { registrationNumber, date, status } = attendanceRecord;

    // Delete the attendance record
    await Attendance.findByIdAndDelete(id);

    // If the status is "Absent", attempt to find and delete the corresponding leave record
    if (status === "Absent") {
      const leaveRecord = await LeaveDetail.findOneAndDelete({
        registrationNumber,
        date: new Date(date), // Match the exact date
      });

      if (leaveRecord) {
        console.log(
          `Leave record for registration number ${registrationNumber} on ${date} deleted.`
        );
      } else {
        console.log(
          `No leave record found for registration number ${registrationNumber} on ${date}.`
        );
      }
    }

    res.status(200).json({
      message: "Attendance record and any related leave record deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting attendance record or related leave record:", error.message);
    res.status(500).json({ message: "Failed to delete attendance record", error });
  }
};
