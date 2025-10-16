import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const {
    dToken,
    getDashData,
    dashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormatter } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

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
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
        Scheduled
      </span>
    );
  };

  return (
    dashData && (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
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
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currency}
                  {dashData.totalEarnings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashData.appointments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashData.patients}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Appointments
                </h2>
                <p className="text-sm text-gray-600">
                  Latest patient appointments
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments &&
            dashData.latestAppointments.length === 0 ? (
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
                  No appointments yet
                </h3>
                <p className="text-gray-600">
                  Your recent appointments will appear here
                </p>
              </div>
            ) : (
              dashData.latestAppointments?.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      src={item.userData?.image}
                      alt={item.userData?.name}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.userData?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {slotDateFormatter(item.slotDate)} at {item.slotTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(item)}

                    {!item.cancelled && !item.isCompleted && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Mark as Completed"
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
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </button>
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
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {dashData.latestAppointments?.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <button
                onClick={() => navigate("/doctor-appointment")}
                className="w-full text-center py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              >
                View All Appointments →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
