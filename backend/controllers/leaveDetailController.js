import LeaveDetail from "../models/leaveDetail.js";
import Attendance from "../models/Attendance.js";
import Student from "../models/studentmodel.js";

// Add Leave Detail Controller
export const addLeaveDetail = async (req, res) => {
    const { studentName, registrationNumber, date, reason } = req.body;

    try {
        // Check if student exists
        const student = await Student.findOne({ registrationNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Check if date is today or earlier
        const selectedDate = new Date(date);
        const today = new Date();
        if (selectedDate > today) {
            return res.status(400).json({ message: "Date cannot be in the future." });
        }

        // Find attendance for the given student and date
        const existingAttendance = await Attendance.findOne({
            registrationNumber,
            date: selectedDate.toISOString().split("T")[0],
        });


         // Function to handle saving/updating leave details
         const saveLeaveDetail = async () => {
          const existingLeaveDetail = await LeaveDetail.findOne({
              registrationNumber,
              date: selectedDate.toISOString().split("T")[0],
          });

          if (existingLeaveDetail) {
              // Update the existing leave record
              existingLeaveDetail.reason = reason;
              existingLeaveDetail.studentName = studentName;
              await existingLeaveDetail.save();
          } else {
              // Create a new leave record
              const newLeaveDetail = new LeaveDetail({
                  studentName,
                  registrationNumber,
                  reason,
                  date: selectedDate,
              });
              await newLeaveDetail.save();
          }
      };


        if (!existingAttendance) {
            // Case 1: No previous attendance record for this student on the selected date
            const newAttendance = new Attendance({
                registrationNumber,
                name: student.name,
                department: student.department,
                domain: student.domain,
                status: "Absent",
                date: selectedDate,
            });
            await newAttendance.save();
            await saveLeaveDetail();

            return res.status(200).json({ message: "Leave added and marked as Absent." });
        } else if (existingAttendance.status === "Absent") {
            await saveLeaveDetail();
            // Case 2: Attendance already marked as Absent
            return res.status(200).json({ message: "Attendance is already marked as Absent." });
        } else if (existingAttendance.status === "Present") {
            // Case 3: Attendance marked as Present
            return res.status(200).json({
                message: "Attendance is marked as Present. Do you want to change it?",
                options: ["OK", "Cancel"],
            });
        }

        return res.status(200).json({ message: "Leave recorded in both collections" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update Attendance Status Controller ( case 3 )
export const updateAttendanceStatus = async (req, res) => {
  const { studentName, registrationNumber, date, reason } = req.body;

  try {

      const student = await Student.findOne({ registrationNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }


      // Check if date is today or earlier
      const selectedDate = new Date(date);
      const today = new Date();
      if (selectedDate > today) {
          return res.status(400).json({ message: "Date cannot be in the future." });
      }


      // Find the attendance record for the given student and date
      const existingAttendance = await Attendance.findOne({
          registrationNumber,
          date: selectedDate.toISOString().split("T")[0],
      });

      // if (!existingAttendance) {
      //     return res.status(404).json({ message: "Attendance record not found." });
      // }

      // Function to handle saving/updating leave details
      const saveLeaveDetail = async () => {
        const existingLeaveDetail = await LeaveDetail.findOne({
            registrationNumber,
            date: selectedDate.toISOString().split("T")[0],
        });

        if (existingLeaveDetail) {
            // Update the existing leave record
            existingLeaveDetail.reason = reason;
            existingLeaveDetail.studentName = studentName;
            await existingLeaveDetail.save();
        } else {
            // Create a new leave record
            const newLeaveDetail = new LeaveDetail({
                studentName,
                registrationNumber,
                reason,
                date: selectedDate,
            });
            await newLeaveDetail.save();
        }
    };

      // Update status to Absent
      existingAttendance.status = "Absent";
      await existingAttendance.save();
      await saveLeaveDetail();

      return res.status(200).json({ message: "Attendance status updated to Absent." });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};



// Get all leave details
export const getLeaveDetails = async (req, res) => {

  console.log("Authenticated User:", req.user); 

  const role = req.user.role; // Get role from authenticated user
  const userDomain = req.user.domain; // Get domain from authenticated user
  const userDepartment = req.user.department; // Get department from authenticated user

  try {

    let filter = {}; 

    if (role === "HOD") {
      filter.department = userDepartment; // Restrict HOD to their department
    } else if (role === "Staff") {
      filter.domain = userDomain; // Restrict Staff to their domain
    }

    console.log("Filter:", filter);
    
    const leaveDetails = await LeaveDetail.find(filter);
    console.log(leaveDetails);
    res.status(200).json(leaveDetails);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave details", error });
  }
};

// Get leave details by registration number
export const getLeaveDetailsByRegistrationNumber = async (req, res) => {
  try {
    const { registrationNumber } = req.params; // Get registrationNumber from URL parameter
    // console.log("registrationNumber : " , registrationNumber);
    const leaveDetails = await LeaveDetail.find({ registrationNumber : registrationNumber.trim().toLowerCase() }); // Find all leave details with the given registrationNumber
    
    if (!Array.isArray(leaveDetails) || leaveDetails.length === 0) {
      return res.status(404).json({ message: "No leave details found for this student" });
    }

    res.status(200).json(leaveDetails); // Return leave details for the given registrationNumber
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave details", error });
  }
};


// Delete Leave Detail
export const deleteLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the leave record by ID
    const leaveRecord = await LeaveDetail.findById(id);
    if (!leaveRecord) {
      return res.status(404).json({ message: "Leave detail not found!" });
    }

    // Extract registrationNumber and date from the leave record
    const { registrationNumber, date } = leaveRecord;

    // Delete the leave record
    await LeaveDetail.findByIdAndDelete(id);


    
    // Find and delete the corresponding attendance record
    const attendanceRecord = await Attendance.findOneAndDelete({
      registrationNumber,
      date,
      status: "Absent",
    });

    if (attendanceRecord) {
      console.log(
        `Attendance record for registration number ${registrationNumber} on ${date} deleted.`
      );
    }

    res.status(200).json({
      message: "Leave detail and any related absent attendance record deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting leave detail or attendance record:", error.message);
    res.status(500).json({ message: "Failed to delete leave detail", error });
  }
};
