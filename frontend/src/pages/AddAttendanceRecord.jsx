import React, { useState } from "react";
import axios from "axios";

const AddAttendanceRecord = () => {
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    department: "",
    domain: "",
    date: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/attendance/add", formData);
      alert("Attendance added/updated successfully!");
    } catch (error) {
      console.error("Error adding/updating attendance:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white shadow-md rounded"
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Add Attendance
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData({ ...formData, registrationNumber: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="domain"
            placeholder="Domain"
            value={formData.domain}
            onChange={(e) =>
              setFormData({ ...formData, domain: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            max={new Date().toISOString().split("T")[0]}
            className="border rounded px-3 py-2 w-full"
          />
          <select
            name="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAttendanceRecord;
