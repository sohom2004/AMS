import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
import { useNavigate } from "react-router-dom";

const LeaveDetails = () => {
  const [leaveDetails, setLeaveDetails] = useState([]); // All students leave details
  const [leavedetailforOne, setLeaveDetailForOne] = useState([]); // One student leave details
  const [searchQuery, setSearchQuery] = useState(""); // Search query for registration number
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState(""); // To track which button was clicked

  const { getLeaveDetails, deleteLeaveDetail } = useGlobalContext();
  const navigate = useNavigate();

  // Fetch leave details for one student
  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery) {
      alert("Please enter a registration number");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/student-leavedetail/leave/${searchQuery.trim()}`
      );
      if (response.ok) {
        const leaveData = await response.json();
        setLeaveDetailForOne(leaveData);
        setLeaveDetails([]); // Clear all-students state
        setActiveView("single"); // Update active view
      } else {
        alert("No leave details found for this student");
        setLeaveDetailForOne([]);
        setActiveView("");
      }
    } catch (error) {
      console.error("Error fetching leave details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all students' leave details
  const handleFetchAllLeaveDetails = async () => {
    try {
      setLoading(true);
      const leaveData = await getLeaveDetails();
      setLeaveDetails(leaveData);
      setLeaveDetailForOne([]); // Clear single-student state
      setActiveView("all"); // Update active view
    } catch (error) {
      console.error("Error fetching leave details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLeaveDetail(id);
      if (activeView === "all") {
        const updatedLeaveDetails = await getLeaveDetails();
        setLeaveDetails(updatedLeaveDetails);
      } else if (activeView === "single") {
        const response = await fetch(
          `/api/student-leavedetail/leave/${searchQuery.trim()}`
        );
        if (response.ok) {
          const leaveData = await response.json();
          setLeaveDetailForOne(leaveData);
        } else {
          setLeaveDetailForOne([]);
        }
      }
    } catch (error) {
      console.error("Error deleting leave detail:", error.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 sm:mb-0">Leave Details</h2>
        <button
          onClick={() => navigate("/addleavedetails")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Add Leave
        </button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search by Registration Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Search
        </button>
      </form>

      {/* Display Leave Details for one student */}
      {activeView === "single" && Array.isArray(leavedetailforOne) && leavedetailforOne.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Student Name</th>
              <th className="border border-gray-300 p-2 text-left">Registration Number</th>
              <th className="border border-gray-300 p-2 text-left">Reason</th>
              <th className="border border-gray-300 p-2 text-left">Date</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leavedetailforOne.map((leave, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{leave.studentName}</td>
                <td className="border border-gray-300 p-2">{leave.registrationNumber}</td>
                <td className="border border-gray-300 p-2">{leave.reason}</td>
                <td className="border border-gray-300 p-2">{leave.date}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDelete(leave._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {/* Fetch All Students Leave Details Button */}
      <button
        onClick={handleFetchAllLeaveDetails}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 w-full sm:w-auto"
      >
        {loading ? "Loading..." : "Fetch All Students Leave Details"}
      </button>

      {/* Table with All Students' Leave Details */}
      {activeView === "all" && leaveDetails.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Student Name</th>
              <th className="border border-gray-300 p-2 text-left">Registration Number</th>
              <th className="border border-gray-300 p-2 text-left">Reason</th>
              <th className="border border-gray-300 p-2 text-left">Date</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveDetails.map((leave, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{leave.studentName}</td>
                <td className="border border-gray-300 p-2">{leave.registrationNumber}</td>
                <td className="border border-gray-300 p-2">{leave.reason}</td>
                <td className="border border-gray-300 p-2">{leave.date}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDelete(leave._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {/* No Data Message */}
      {activeView === "" && <p className="text-gray-700 mt-4">No leave details available.</p>}
    </div>
  );
};

export default LeaveDetails;
