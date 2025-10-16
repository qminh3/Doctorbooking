import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { Admincontext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Slidebar from "./components/Slidebar";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointments from "./pages/Admin/AllApointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";

function App() {
  const { aToken } = useContext(Admincontext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className="bg-[#F8F8F8] min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Slidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route
              path="/"
              element={
                aToken ? (
                  <Navigate to="/admin-dashboard" replace />
                ) : dToken ? (
                  <Navigate to="/doctor-dashboard" replace />
                ) : (
                  <Navigate to="/admin-dashboard" replace />
                )
              }
            />

            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointment" element={<AllApointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />

            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointment" element={<DoctorAppointment />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  ) : (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
}

export default App;
