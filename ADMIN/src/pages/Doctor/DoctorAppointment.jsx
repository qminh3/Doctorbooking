import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { caculateAge, slotDateFormatter, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
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

  const getPaymentBadge = (item) => {
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          item.payment
            ? "bg-green-100 text-green-800"
            : "bg-orange-100 text-orange-800"
        }`}
      >
        {item.payment ? "Paid" : "CASH"}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-green-500  rounded-lg flex items-center justify-center">
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Manage patient appointments</p>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700">
              Total:{" "}
              <span className="text-green-600">{appointments.length}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2fr_1fr_1.5fr] gap-4 items-center">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                #
              </p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Patient
              </p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Payment
              </p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Age
              </p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Date & Time
              </p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Fee
              </p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Action
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {appointments.length === 0 ? (
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-600">
                  Your appointments will appear here when patients book with
                  you.
                </p>
              </div>
            ) : (
              appointments.map((item, index) => (
                <div
                  key={item._id || index}
                  className="grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2fr_1fr_1.5fr] gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <p className="text-sm font-medium text-gray-600">
                    {index + 1}
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      src={item.userData.image}
                      alt={item.userData.name}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.userData.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.userData.email}
                      </p>
                    </div>
                  </div>

                  <div>{getPaymentBadge(item)}</div>

                  <p className="text-sm text-gray-700 font-medium">
                    {caculateAge(item.userData.dob)} yrs
                  </p>

                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {slotDateFormatter(item.slotDate)}
                    </p>
                    <p className="text-gray-500">{item.slotTime}</p>
                  </div>

                  {/* Fee */}
                  <p className="text-sm font-semibold text-green-600">
                    {currency}
                    {item.amount}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item)}
                    {!item.cancelled && !item.isCompleted && (
                      <div className="flex items-center gap-1 ml-2">
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
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {appointments.length === 0 ? (
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                Your appointments will appear here when patients book with you.
              </p>
            </div>
          ) : (
            appointments.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      src={item.userData.image}
                      alt={item.userData.name}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.userData.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Age: {caculateAge(item.userData.dob)} years
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(item)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    <span className="text-sm text-gray-700">
                      {slotDateFormatter(item.slotDate)} at {item.slotTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-green-600">
                        Fee: {currency}
                        {item.amount}
                      </span>
                      {getPaymentBadge(item)}
                    </div>
                    {!item.cancelled && !item.isCompleted && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className="px-3 py-1 text-green-600 border border-green-300 rounded-lg text-sm hover:bg-green-50 transition-colors duration-200"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="px-3 py-1 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
