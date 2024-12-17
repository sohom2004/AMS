import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const [attendance, setAttendance] = useState(85); // Sample attendance percentage
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simulate fetching recent activities
    setRecentActivities([
      { id: 1, activity: "Added a new student: John Doe" },
      { id: 2, activity: "Marked attendance for Class A" },
      { id: 3, activity: "Approved leave for Jane Smith" },
    ]);
  }, []);

  return (
    <div className="dashboard p-4 bg-gray-50 min-h-screen">
      {/* Greeting Section */}
      <header className="dashboard-header text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Welcome {role}!
        </h1>
        <p className="text-gray-700">Manage the Attendance efficiently.</p>
      </header>

      {/* Quick Access Section */}
      <section className="quick-access grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="card bg-white shadow-md p-4 rounded-lg hover:bg-blue-100 cursor-pointer"
          onClick={() => alert("Navigate to Add Students")}
        >
          <h2 className="text-xl font-semibold text-blue-600">Add Students</h2>
          <p className="text-gray-600">Register new students for attendance tracking.</p>
        </div>
        <div
          className="card bg-white shadow-md p-4 rounded-lg hover:bg-blue-100 cursor-pointer"
          onClick={() => alert("Navigate to View Attendance")}
        >
          <h2 className="text-xl font-semibold text-blue-600">View Attendance</h2>
          <p className="text-gray-600">Check and manage attendance records.</p>
        </div>
        <div
          className="card bg-white shadow-md p-4 rounded-lg hover:bg-blue-100 cursor-pointer"
          onClick={() => alert("Navigate to Leave Requests")}
        >
          <h2 className="text-xl font-semibold text-blue-600">Leave Requests</h2>
          <p className="text-gray-600">Approve or reject leave requests.</p>
        </div>
        <div
          className="card bg-white shadow-md p-4 rounded-lg hover:bg-blue-100 cursor-pointer"
          onClick={() => alert("Navigate to Facial Recognition")}
        >
          <h2 className="text-xl font-semibold text-blue-600">Facial Recognition</h2>
          <p className="text-gray-600">Mark attendance using the facial recognition system.</p>
        </div>
      </section>

      {/* Attendance Overview Section */}
      <section className="attendance-overview text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Attendance Overview</h2>
        <div className="attendance-circle bg-blue-100 p-6 rounded-full inline-block">
          <span className="text-4xl font-bold text-blue-600">{attendance}%</span>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section className="recent-activities">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <ul className="space-y-2">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="text-gray-700">
              {activity.activity}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
