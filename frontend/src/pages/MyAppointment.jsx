import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const MyAppointment = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const months = [
    "",
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const slotDateFormatter = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendURL}/api/user/list-appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log("User appointments:", data.appointments);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in fetching user appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in cancelling appointment");
    }
  };

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

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
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
                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.5a1 1 0 011 1v9a1 1 0 01-1 1H7.5a1 1 0 01-1-1V8a1 1 0 011-1H8z"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        </div>
      </div>

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
                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.5a1 1 0 011 1v9a1 1 0 01-1 1H7.5a1 1 0 01-1-1V8a1 1 0 011-1H8z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600">
            You haven't booked any appointments yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover bg-gradient-to-br from-blue-50 to-indigo-100"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        Dr. {item.docData.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {item.docData.speciality}
                      </p>
                    </div>
                    {getStatusBadge(item)}
                  </div>

                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <div className="text-sm text-gray-600">
                      <p>{item.docData.address.line1}</p>
                      <p>{item.docData.address.line2}</p>
                    </div>
                  </div>

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
                    <span className="text-sm font-medium text-gray-700">
                      {slotDateFormatter(item.slotDate)} at {item.slotTime}
                    </span>
                  </div>

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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      ></path>
                    </svg>
                    <span className="text-sm font-semibold text-green-600">
                      ${item.amount}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex flex-col gap-3 lg:min-w-[180px]">
                    {!item.cancelled && !item.isCompleted && (
                      <>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2">
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
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            ></path>
                          </svg>
                          Pay Online
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 flex items-center justify-center gap-2"
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
                          Cancel
                        </button>
                      </>
                    )}

                    {item.cancelled && (
                      <div className="text-center py-3 px-4 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-sm text-red-600 font-medium">
                          Appointment Cancelled
                        </span>
                      </div>
                    )}

                    {item.isCompleted && (
                      <div className="text-center py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm text-green-600 font-medium">
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
