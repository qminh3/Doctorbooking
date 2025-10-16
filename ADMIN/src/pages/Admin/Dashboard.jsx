import React from "react";
import { useContext } from "react";
import { Admincontext } from "../../context/AdminContext";
import { useEffect } from "react";
import doctor_icon from "../../assets/assets_admin/doctor_icon.svg";
import appointment_icon from "../../assets/assets_admin/appointments_icon.svg";
import user_icon from "../../assets/assets_admin/patients_icon.svg";
import list_icon from "../../assets/assets_admin/list_icon.svg";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { aToken, dashboardData, getDashboard, cancelAppointment } =
    useContext(Admincontext);
  const { slotDateFormatter } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getDashboard();
    }
  }, [aToken]);

  const getStatusBadge = (item) => {
    if (item.cancelled) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          Cancelled
        </span>
      );
    }
    if (item.isCompleted) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Completed
        </span>
      );
    }
    if (item.payment) {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Paid
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
        Pending
      </span>
    );
  };

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your clinic today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-800 mb-1">
                {dashboardData.doctors}
              </p>
              <p className="text-blue-600 font-medium">Active Doctors</p>
              <p className="text-blue-500 text-sm mt-1">
                Managing patient care
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
              <img className="w-10 h-10" src={doctor_icon} alt="Doctors" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-800 mb-1">
                {dashboardData.appointments}
              </p>
              <p className="text-green-600 font-medium">Total Appointments</p>
              <p className="text-green-500 text-sm mt-1">Scheduled visits</p>
            </div>
            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
              <img
                className="w-10 h-10"
                src={appointment_icon}
                alt="Appointments"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-purple-800 mb-1">
                {dashboardData.patients}
              </p>
              <p className="text-purple-600 font-medium">Registered Patients</p>
              <p className="text-purple-500 text-sm mt-1">Active users</p>
            </div>
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
              <img className="w-10 h-10" src={user_icon} alt="Patients" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <img className="w-4 h-4" src={list_icon} alt="List" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Latest scheduled appointments
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {dashboardData.lastestAppointments &&
          dashboardData.lastestAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.5a1 1 0 011 1v9a1 1 0 01-1 1H7.5a1 1 0 01-1-1V8a1 1 0 011-1H8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No recent appointments
              </h3>
              <p className="text-gray-600">
                Recent appointments will appear here when available.
              </p>
            </div>
          ) : (
            dashboardData.lastestAppointments?.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {item.docData.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {item.docData.speciality}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {slotDateFormatter(item.slotDate)}
                    </p>
                    <p className="text-sm text-gray-500">{item.slotTime}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(item)}
                    {!item.cancelled && !item.isCompleted && (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Cancel Appointment"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {dashboardData.lastestAppointments &&
          dashboardData.lastestAppointments.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {dashboardData.lastestAppointments.length} recent
                  appointments
                </p>
                <button
                  onClick={() => navigate("/all-appointment")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Appointments →
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
