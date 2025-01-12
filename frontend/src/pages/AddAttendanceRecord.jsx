import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAttendanceRecord = () => {

  const navigate = useNavigate();

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
      await axios.post("http://localhost:5000/api/attendance/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Attendance added/updated successfully!");
      navigate("/attendance-record");
    } catch (error) {
      console.error("Error adding/updating attendance:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-green-400 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Add Attendance
        </h1>
        <div className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded px-4 py-2 w-full"
            required
          />
          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData({ ...formData, registrationNumber: e.target.value })
            }
            className="border rounded px-4 py-2 w-full"
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="border rounded px-4 py-2 w-full"
            required
          />
          <input
            type="text"
            name="domain"
            placeholder="Domain"
            value={formData.domain}
            onChange={(e) =>
              setFormData({ ...formData, domain: e.target.value })
            }
            className="border rounded px-4 py-2 w-full"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            max={new Date().toISOString().split("T")[0]}
            className="border rounded px-4 py-2 w-full"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="border rounded px-4 py-2 w-full"
            required
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        <div className="mt-6 flex justify-center">
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
