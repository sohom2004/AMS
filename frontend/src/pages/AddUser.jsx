// frontend/src/pages/AddUser.jsx
import React, { useState } from 'react';
import api from '../utils/axiosConfig';

const AddUser = () => {
  const [role, setRole] = useState('Student');
  const [domain, setDomain] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { role, domain, department, password });
      alert('User added successfully');
    } catch (error) {
      console.error('Error adding user', error);
      alert('Error adding user. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleAddUser}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Add User
        </h2>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="HOD">HOD</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="domain">
            Domain
          </label>
          <input
            id="domain"
            type="text"
            placeholder="Enter Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="department">
            Department
          </label>
          <input
            id="domain"
            type="text"
            placeholder="Enter Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition duration-300"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
