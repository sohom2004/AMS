import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; 

const Navbar = () => {

  const role = localStorage.getItem('role'); // get role from local storage
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        {
          role === 'Staff' && (
            <Link to="/face-detection" className="nav-link">Face Detection</Link>
          )
        }
        {
          role === 'Staff' && (
            <Link to="/add-user" className="nav-link">Add User</Link>
          )
        }

        { role === 'Staff' && (
          <Link to="/studentrecords" className="nav-link">Add Student</Link>
        )}

        <Link to="/leave-details" className="nav-link">Leave Details</Link>
        <Link to="/attendance-record" className="nav-link">Attendance Record</Link>
      </div>
      <div className="navbar-right">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
