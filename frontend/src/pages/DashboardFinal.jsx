import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    return (
        <div className="dashboard bg-gradient-to-b from-blue-500 to-green-400 min-h-screen p-6">
            {/* Greeting Section */}
            <header className="dashboard-header text-center mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Welcome, {role}!
                </h1>
                <p className="text-lg text-gray-200">Efficiently manage attendance and records.</p>
            </header>

            {/* Quick Access Section */}
            <section className="quick-access grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div
                    className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate("/studentrecords")}
                >
                    <h2 className="text-xl font-semibold text-blue-600">Add Students</h2>
                    <p className="text-gray-600">Register new students for attendance tracking.</p>
                </div>
                <div
                    className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate("/attendance-record")}
                >
                    <h2 className="text-xl font-semibold text-blue-600">View Attendance</h2>
                    <p className="text-gray-600">Check and manage attendance records.</p>
                </div>
                <div
                    className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate("/leave-details")}
                >
                    <h2 className="text-xl font-semibold text-blue-600">Leave Requests</h2>
                    <p className="text-gray-600">Approve or reject leave requests.</p>
                </div>
                <div
                    className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate("/face-detection")}
                >
                    <h2 className="text-xl font-semibold text-blue-600">Facial Recognition</h2>
                    <p className="text-gray-600">Mark attendance using the facial recognition system.</p>
                </div>
            </section>

            {/* Static Section: About the System */}
            <section className="about-system bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">About the System</h2>
                <p className="text-gray-700">
                    This system provides an efficient way to manage student attendance, leave requests, and facial recognition for accurate tracking. Designed with simplicity and functionality in mind, it ensures smooth operations for administrators and teachers alike.
                </p>
            </section>

            {/* Static Section: Tips for Better Usage */}
            <section className="usage-tips bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Tips for Better Usage</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-3">
                    <li>Ensure student records are updated regularly for accurate attendance tracking.</li>
                    <li>Use the facial recognition feature for quick and hassle-free attendance marking.</li>
                    <li>Review and respond to leave requests promptly to maintain proper records.</li>
                    <li>Backup the attendance data periodically for added security.</li>
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;
