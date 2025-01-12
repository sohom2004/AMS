import { createContext, useState, useContext } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);

  // Flash message handler
  const showFlashMessage = (message, type = "success") => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };

  // Common error handler
  const handleError = (error, defaultMessage) => {
    const message =
      error.response?.data?.message || error.message || defaultMessage;
    showFlashMessage(message, "error");
    throw new Error(message);
  };

  // CRUD operations for students
  const addStudent = async (studentData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}students/add`, studentData);
      showFlashMessage(response.data.message, "success");
      return response.data;
    } catch (error) {
      handleError(error, "Error adding student");
    } finally {
      setLoading(false);
    }
  };

  const getStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}students`);
      return response.data;
    } catch (error) {
      handleError(error, "Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const getStudentById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}students/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, "Error fetching student");
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}students/${id}`,
        updatedData
      );
      showFlashMessage(response.data.message, "success");
      return response.data;
    } catch (error) {
      handleError(error, "Error updating student");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}students/${id}`);
      showFlashMessage(response.data.message, "success");
      return response.data;
    } catch (error) {
      handleError(error, "Error deleting student");
    } finally {
      setLoading(false);
    }
  };

  // Attendance-related operations
  const addAttendance = async (attendanceData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}studentattendance`,
        attendanceData
      );
      showFlashMessage(response.data.message, "success");
      return response.data;
    } catch (error) {
      handleError(error, "Error marking attendance");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceByRegistrationNo = async (registrationNo) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}studentattendance/${registrationNo}`
      );
      return response.data;
    } catch (error) {
      handleError(error, "Error fetching attendance for the student");
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async (attendanceId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}studentattendance/${attendanceId}`,
        updatedData
      );
      showFlashMessage(response.data.message, "success");
      return response.data;
    } catch (error) {
      handleError(error, "Error updating attendance");
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async (attendanceId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}studentattendance/${attendanceId}`
      );
      showFlashMessage(response.data.message, "success");
      return response.data;
    } catch (error) {
      handleError(error, "Error deleting attendance");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceByDate = async (date) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}studentattendance/date/${date}`);
      return response.data;
    } catch (error) {
      handleError(error, "Error fetching attendance for the date");
    } finally {
      setLoading(false);
    }
  };


  const addLeaveDetail = async (leaveData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/student-leavedetail/leave`, leaveData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (res.status === 409) {
        const userConfirmed = window.confirm(res.data.message);
        if (userConfirmed) {
          // If the student is marked as Present, update attendance to "Absent"
          const updateRes = await axios.put(
            `${BASE_URL}/student-leavedetail/leave`, 
            { ...leaveData, forceupdate: true },  // Add forceupdate flag if necessary
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          
          // Handle success for leave details update
          showFlashMessage(updateRes.data.message || "Leave detail updated successfully.", "success");
        } else {
          showFlashMessage("Leave detail update canceled.", "info");
        }
      } else {
        showFlashMessage(res.data.message || "Leave detail added successfully.", "success");
      }
    } catch (error) {
      showFlashMessage(error.response?.data?.message || "Error adding leave detail.", "error");
    } finally {
      setLoading(false);
    }
  };
  

  // const [leaveDetails, setLeaveDetails] = ([])
  const getLeaveDetails = async () => {
    try {
      const response = await fetch("/api/student-leavedetail/leave", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token from localStorage
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch leave details");
      }
  
      const data = await response.json();
      console.log("Fetched leave details:", data); // Debugging log
      return data;
      showFlashMessage(response.data.message || "Leave detail fetched successfully", "success");
    } catch (error) {
      console.error("Error in getLeaveDetails:", error.message);
      throw error;
    }
  };
  
  const deleteLeaveDetail = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}student-leavedetail/leave/${id}`);
      showFlashMessage(res.data.message || "Leave detail deleted successfully", "success");
    } catch (error) {
      showFlashMessage(
        error.response?.data?.message || "Error deleting leave detail",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <GlobalContext.Provider
      value={{
        loading,
        flashMessage,
        addStudent,
        getStudents,
        getStudentById,
        updateStudent,
        deleteStudent,
        addAttendance,
        getAttendanceByRegistrationNo,
        updateAttendance,
        deleteAttendance,
        getAttendanceByDate,
        addLeaveDetail,
        getLeaveDetails,
        deleteLeaveDetail,
      }}
    >
      {/* Flash message component */}
      {flashMessage && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            padding: "10px 20px",
            backgroundColor:
              flashMessage.type === "success" ? "#4caf50" : "#f44336",
            color: "#fff",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          {flashMessage.message}
        </div>
      )}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
