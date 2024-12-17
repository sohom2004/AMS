import React, { useState } from "react";
import axios from "axios";
import "../styles/AddStudent.css";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    department: "",
    domain: "",
    year: "",
    images: [],
  });
  const [students, setStudents] = useState([]); // Holds the student list
  const [editingStudent, setEditingStudent] = useState(null); // Holds the student being edited
  const [showStudents, setShowStudents] = useState(false); // Tracks if students should be displayed

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  // Add a new student
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
      // Send data to the Node.js server
      const nodeResponse = await axios.post("http://localhost:5000/api/students", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Node.js Response:", nodeResponse.data);

      // Send the same data to the Flask server
      // const flaskResponse = await axios.post(
      //   `http://127.0.0.1:8000/add?name=${formData.name}&registrationNumber=${formData.registrationNumber}`,
      //   form.get("images"),
      //   {
      //     headers: { "Content-Type": "application/octet-stream" },
      //   }
      // );


      alert("Student added successfully!");
      if (showStudents) fetchStudents(); // Refresh students if table is visible
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student. Please try again.");
    }
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students/getallstudents");
      console.log("Fetched Students:", response.data);
      setStudents(response.data);
      setShowStudents(true);
    } catch (error) {
      console.error("Error fetching students:", error.response?.data || error.message);
      alert("Error fetching students. Please try again.");
    }
  };

  // Delete a student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      alert("Student deleted successfully!");
      fetchStudents(); // Refresh students
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student. Please try again.");
    }
  };

  // Edit a student
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
  };

  // Update student details
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, formData);
      alert("Student updated successfully!");
      setEditingStudent(null); // Exit editing mode
      fetchStudents(); // Refresh students
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form
        onSubmit={editingStudent ? handleUpdate : handleSubmit}
        encType="multipart/form-data"
        className="grid gap-4"
      >
        <h2 className="text-xl font-bold text-gray-700 mb-4">
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
          name="domain"
          placeholder="Domain"
          value={formData.domain}
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
                <th className="border p-2">Domain</th>
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
                  <td className="border p-2">{student.domain}</td>
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
  );
};

export default AddStudent;
