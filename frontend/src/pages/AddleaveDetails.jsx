import React from "react";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
import { useNavigate } from "react-router-dom";

const AddLeaveDetails = () => {
  const { addLeaveDetail } = useGlobalContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const leaveData = {
      studentName: formData.get("studentName"),
      registrationNumber: formData.get("registrationNumber"),
      date: formData.get("date"), // Get the date value
      reason: formData.get("reason"),
    };

    try {
      await addLeaveDetail(leaveData);
      alert("Leave details submitted successfully!");
      navigate("/leave-details");
    } catch (error) {
      console.error("Error submitting leave details:", error.message);
      alert("Failed to submit leave details. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        Add Leave Details
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Student Name
          </label>
          <input
            type="text"
            name="studentName"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter student name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Registration Number
          </label>
          <input
            type="text"
            name="registrationNumber"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter registration number"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Date</label>
          <input
            type="date"
            name="date"
            className="w-full border border-gray-300 rounded p-2"
            max={new Date().toISOString().split("T")[0]} // Restrict to today or earlier
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Reason
          </label>
          <textarea
            name="reason"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter reason for leave"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => navigate("/leave-details")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};


export default AddLeaveDetails;
