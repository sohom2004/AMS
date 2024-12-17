import React, { useState } from "react";
import api from "../utils/axiosConfig"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("HOD");
  const [domain, setDomain] = useState("");
  const [department, setDepartment] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        role,
        username,
        password,
        ...(role === "HOD" && { department }),
        ...(role === "Staff" && { domain }),
      };

      const response = await api.post("/auth/login", loginData);
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials or login failed.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <div className="mb-4">
          <label className="block mb-2">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="HOD">HOD</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        {role === "HOD" && (
          <div className="mb-4">
            <label className="block mb-2">Department:</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value.toUpperCase())}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {role === "Staff" && (
          <div className="mb-4">
            <label className="block mb-2">Domain:</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
