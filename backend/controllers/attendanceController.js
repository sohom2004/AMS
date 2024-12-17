import Attendance from "../models/Attendance.js";

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
  const { registrationNumber, department, domain } = req.query;

  try {
    let filter = {};
    if (registrationNumber) filter.registrationNumber = registrationNumber;
    if (department) filter.department = department;
    if (domain) filter.domain = domain;

    const attendanceRecords = await Attendance.find(filter);
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Attendance Record
export const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance record:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
