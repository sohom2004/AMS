import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "../styles/AddStudent.css";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    department: "",
    year: "",
    images: [],
  });

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showStudents, setShowStudents] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((file) => form.append("images", file));
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const nodeResponse = await axios.post("http://localhost:5000/api/students", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response:", nodeResponse.data);
      alert("Student added successfully!");
      navigate("/studentrecords");
      if (showStudents) fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student. Please try again.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students/getallstudents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched Students:", response.data);
      setStudents(response.data);
      setShowStudents(true);
    } catch (error) {
      console.error("Error fetching students:", error.response?.data || error.message);
      alert("Error fetching students. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student. Please try again.");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Student updated successfully!");
      navigate("/studentrecords");
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-500 to-green-400">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <form
          onSubmit={editingStudent ? handleUpdate : handleSubmit}
          encType="multipart/form-data"
          className="grid gap-4"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            {editingStudent ? "Edit Student" : "Add Student"}
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Name"  
            value={formData.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded p-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
        </form>

        <button
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          onClick={fetchStudents}
        >
          Get All Students
        </button>

        {showStudents && students.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Registration Number</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Year</th>
                  <th className="border p-2">Edit</th>
                  <th className="border p-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.registrationNumber}</td>
                    <td className="border p-2">{student.email}</td>
                    <td className="border p-2">{student.department}</td>
                    <td className="border p-2">{student.year}</td>
                    <td className="border p-2 text-center">
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(student.registrationNumber)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
