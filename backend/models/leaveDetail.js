import mongoose from "mongoose";
import Student from "./studentmodel.js";

const leaveDetailSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  registrationNumber: { type: String, required: true, ref: 'Student', },
  department : { type: String },
  domain : { type : String },
  reason: { type: String, required: true },
  date: { type: Date, required: true }, // Automatically adds the date
});

leaveDetailSchema.pre('save', async function (next) {
  try {
    const student = await Student.findOne({ registrationNumber: this.registrationNumber });
    console.log('Fetched Student:', student);
    if (student) {
      this.studentName = student.name;
      this.department = student.department;
      this.domain = student.domain;
    }
    next();
  } catch (error) {
    next(error);
  }
}
);

export default mongoose.model("LeaveDetail", leaveDetailSchema);