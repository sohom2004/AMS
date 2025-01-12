import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  registrationNumber: {
    type: String, 
    required: true, 
    ref: "Student" // Links to the Student schema
  },
  name: {
    type: String, 
  },
  department: {
    type: String, 
  },
  domain: {
    type: String, 
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"], // Status options
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Defaults to today's date
  },
});

// Middleware to populate name, department, and domain from the Student schema
attendanceSchema.pre('save', async function (next) {
  try {
    const Student = mongoose.model('Student');
    const student = await Student.findOne({ registrationNumber: this.registrationNumber });
    if (student) {
      this.name = student.name;
      this.department = student.department;
      this.domain = student.domain;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Attendance", attendanceSchema);
