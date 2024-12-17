import LeaveDetail from "../models/leaveDetail.js";

// Add leave detail
export const addLeaveDetail = async (req, res) => {
  try {
    const { studentName, registrationNumber, reason, date } = req.body;
    const leaveDetail = new LeaveDetail({ studentName, registrationNumber, reason, date });
    await leaveDetail.save();
    res.status(201).json({ message: "Leave detail added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add leave detail", error });
  }
};

// Get all leave details
export const getLeaveDetails = async (req, res) => {
  try {
    const leaveDetails = await LeaveDetail.find();
    res.status(200).json(leaveDetails);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave details", error });
  }
};

// Get leave details by registration number
export const getLeaveDetailsByRegistrationNumber = async (req, res) => {
  try {
    const { registrationNumber } = req.params; // Get registrationNumber from URL parameter
    console.log("registrationNumber : " , registrationNumber);
    const leaveDetails = await LeaveDetail.find({ registrationNumber : registrationNumber.trim().toLowerCase() }); // Find all leave details with the given registrationNumber
    
    if (!Array.isArray(leaveDetails) || leaveDetails.length === 0) {
      return res.status(404).json({ message: "No leave details found for this student" });
    }

    res.status(200).json(leaveDetails); // Return leave details for the given registrationNumber
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave details", error });
  }
};

// Delete leave detail
export const deleteLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    await LeaveDetail.findByIdAndDelete(id);
    res.status(200).json({ message: "Leave detail deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete leave detail", error });
  }
};
