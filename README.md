# Attendify

---

# Facial Recognition-Based Attendance Management System

A sophisticated **Facial Recognition Attendance Management System** designed to leverage the power of **AI and dlib** for seamless attendance tracking. This system ensures high accuracy, enhanced security, and unparalleled convenience for educational institutions and workplaces.

---

## 🚀 Features

- **AI-Powered Facial Recognition**  
  Utilizes the **dlib library** to generate embeddings for each student. Captured images are compared against stored embeddings in the database to mark attendance accurately.

- **Role-Based Access Control**  
  - **Head of Department (HOD):** Oversee department-wide attendance and manage leave records.
  - **Staff:** Add students, manage attendance, and track leave details.

- **Student Management**  
  Store and organize student details, including their department, roll number, and unique facial embeddings.

- **Attendance Dashboard**  
  Interactive dashboard with filters for department, domain, and date-based attendance insights.

- **Leave Management**  
  Streamlined leave request tracking and approval.

- **Manual and Automated Updates**  
  Supports both manual updates and AI-driven automation for flexible operation.

- **Secure Authentication**  
  Implements **JWT-based authentication** with **bcrypt** for robust security.

---

## 🛠️ Tech Stack

- **Frontend:** React (with Vite), Tailwind CSS for a dynamic, responsive design.
- **Backend:** Node.js and Express.js for RESTful APIs.
- **Database:** MongoDB Atlas for storing student data, embeddings, and attendance records.
- **Facial Recognition:** Python and the **dlib library** for embedding generation and similarity comparison.
- **Authentication:** JSON Web Tokens (JWT) and bcrypt for hashed password storage.

---

## 📷 How It Works

1. **Student Enrollment**  
   - Admins upload student details and images.
   - The **dlib library** generates unique facial embeddings, which are stored in the database.

2. **Attendance Marking**  
   - A student's image is captured during attendance.
   - The system compares the embeddings of the captured image with stored embeddings.
   - On successful similarity matching, attendance is automatically marked.

3. **Monitoring and Reporting**  
   - Role-specific dashboards provide real-time attendance tracking and detailed reports.

---

## 🌟 Why Choose This System?

- **Accuracy:** High precision in face matching using advanced AI techniques.
- **Efficiency:** Automates attendance marking, saving time and effort.
- **Security:** Protects sensitive data with encrypted storage and secure authentication.
- **Scalability:** Handles large datasets effortlessly.
- **Customizability:** Adaptable to various organizational needs.

---

## 🔧 Installation and Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/Adityar9764/Attendify.git
   cd Attendify
   ```

2. Install dependencies for the backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Set up `.env` files with database credentials, JWT secret, and Python integration details.

4. Install Python requirements:
   ```bash
   pip install dlib numpy opencv-python
   ```

5. Start the development servers:
   ```bash
   cd backend
   npm run dev
   cd ../frontend
   npm run dev
   ```

6. Access the application at `http://localhost:5173`.

---

## 📂 Project Structure

- **Backend:** RESTful APIs for authentication, attendance, and student management.
- **Frontend:** React components for role-specific dashboards and features.
- **Database Models:** MongoDB schemas for students, attendance, and roles.
- **Facial Recognition:** Python scripts for embedding generation and similarity comparison using **dlib**.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **Libraries & Frameworks:** React, Tailwind CSS, Node.js, Express, MongoDB, dlib, and more.
- **AI Tools:** The **dlib library** for state-of-the-art facial recognition.

---
