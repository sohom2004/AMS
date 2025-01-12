import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddLeaveDetails = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        studentName: "",
        registrationNumber: "",
        date: "",
        reason: "",
    });
    const [message, setMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/student-leavedetail/leave", formData);
            const { message, options } = response.data;

            if (options && options.includes("OK")) {
                setShowConfirm(true);
                setMessage(message);
            } else {
                setMessage(message);
                navigate("/leave-details");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    };

    const handleConfirm = async (confirm) => {
        if (confirm) {
            try {
                await axios.put("/api/student-leavedetail/leave", formData); // API to update attendance status
                setMessage("Attendance status updated to Absent.");
                navigate("/leave-details");
            } catch (error) {
                setMessage(error.response?.data?.message || "Something went wrong.");
            }
        }
        setShowConfirm(false);
    };

    return (
        <div className="flex flex-col items-center bg-gradient-to-b from-blue-500 to-green-400 min-h-screen p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">Add Leave Details</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name:</label>
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Number:</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            max={new Date().toISOString().split("T")[0]}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reason:</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Submit
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-sm font-medium text-gray-800 bg-green-200 p-2 rounded-md">
                        {message}
                    </p>
                )}
                {showConfirm && (
                    <div className="mt-6 p-4 bg-white rounded-md shadow-md text-center">
                        <p className="text-gray-700 mb-4">{message}</p>
                        <button
                            onClick={() => handleConfirm(true)}
                            className="bg-green-600 text-white py-2 px-4 rounded-md mr-2 hover:bg-green-700 transition-colors"
                        >
                            OK
                        </button>
                        <button
                            onClick={() => handleConfirm(false)}
                            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddLeaveDetails;
