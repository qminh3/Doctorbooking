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

function App() {
  const { aToken } = useContext(Admincontext);
  return aToken ? (
    <div className="bg-[#F8F8F8] min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Slidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/admin-dashboard" replace />}
            />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointment" element={<AllApointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />
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
