import mongoose from "mongoose";
import Student from "./studentmodel.js";

const leaveDetailSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  registrationNumber: { type: String, required: true, ref: 'Student', },
  reason: { type: String, required: true },
  date: { type: Date, required: true }, // Automatically adds the date
});

// module.exports = mongoose.model("LeaveDetail", leaveDetailSchema);

export default mongoose.model("LeaveDetail", leaveDetailSchema);


leaveDetailSchema.post('save', async function (doc) {
  const Attendance = require('./Attendance'); // Assuming Attendance schema is defined
  const daysOnLeave = Math.ceil(
    (doc.endDate - doc.startDate) / (1000 * 60 * 60 * 24)
  );

  try {
    const attendance = await Attendance.findOne({ registrationNumber: doc.registrationNumber });
    if (attendance) {
      attendance.daysAbsent += daysOnLeave;
      await attendance.save();
    } else {
      console.warn('Attendance record not found for registrationNumber:', doc.registrationNumber);
    }
  } catch (err) {
    console.error('Error updating attendance:', err);
  }
});
