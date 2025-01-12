import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AttendanceRecord = () => {
  const [attendance, setAttendance] = useState([]);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [domainSearch, setDomainSearch] = useState("");
  const [registrationSearch, setRegistrationSearch] = useState("");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");


  const navigate = useNavigate();

  const fetchAttendance = async (query = {}) => {
    try {

      const role = localStorage.getItem("role");
      const domain = localStorage.getItem("domain");

      const response = await axios.get("http://localhost:5000/api/attendance", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in Authorization header
        },
      });
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error.message);
    }
  };

  const handleFetchByRegistration = () => {
    fetch(`http://localhost:5000/api/attendance/?registrationNumber=${registrationSearch}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in Authorization header
      },
    })
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error(err));
  };
  
  const handleFetchByDepartment = () => {
    fetch(`http://localhost:5000/api/attendance/?department=${departmentSearch}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in Authorization header
      },
    })
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error(err));
  };
  
  const handleFetchByDomain = () => {
    fetch(`http://localhost:5000/api/attendance/?domain=${domainSearch}` , {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in Authorization header
      },
    })
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error(err));
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/attendance/${id}` , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in Authorization header
        },
      });
      fetchAttendance();
    } catch (error) {
      console.error("Error deleting record:", error.message);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-md p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Attendance Records
        </h1>

        <div className="p-4 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-md p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-blue-600">Attendance Records</h1>
      <button
        onClick={() => navigate("/add-attendance")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Attendance
      </button>
    </div>

    <div className="flex flex-wrap gap-4 mb-6 items-center">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search by Registration Number"
          value={registrationSearch}
          onChange={(e) => setRegistrationSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFetchByRegistration}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Search
        </button>
      </div>

      {/* {role === "HOD" && (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Department"
            value={departmentSearch}
            onChange={(e) => setDepartmentSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFetchByDepartment}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Search
          </button>
        </div>
      )} */}

      {/* {role === "Staff" && (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Domain"
            value={domainSearch}
            onChange={(e) => setDomainSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFetchByDomain}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Search
          </button>
        </div>
      )} */}

      <button
        onClick={fetchAttendance}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Fetch All Records
      </button>
    </div>

    {/* Table */}
    {attendance.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Registration Number</th>
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Domain</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{record.name}</td>
                <td className="border border-gray-300 p-2">
                  {record.registrationNumber}
                </td>
                <td className="border border-gray-300 p-2">{record.department}</td>
                <td className="border border-gray-300 p-2">{record.domain}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">{record.status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-center text-gray-500">No attendance records found.</p>
    )}
  </div>
</div>
</div>
</div>
);
};

export default AttendanceRecord;
