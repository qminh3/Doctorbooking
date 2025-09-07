import React, { useContext } from "react";
import { Admincontext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";

const Sidebar = () => {
  const { aToken } = useContext(Admincontext);

  const navItems = [
    {
      to: "/admin-dashboard",
      icon: assets.home_icon,
      label: "Dashboard",
    },
    {
      to: "/all-appointment",
      icon: assets.appointment_icon,
      label: "Appointments",
    },
    {
      to: "/add-doctor",
      icon: assets.add_icon,
      label: "Add Doctor",
    },
    {
      to: "/doctor-list",
      icon: assets.people_icon,
      label: "Doctors List",
    },
  ];

  return (
    <div className="min-h-screen bg-white border-r border-gray-200 shadow-sm">
      {aToken ? (
        <nav className="pt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-4 px-6 mx-2 rounded-lg transition-all duration-200 ease-in-out text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                        : ""
                    }`
                  }
                >
                  <img
                    src={item.icon}
                    alt={`${item.label} icon`}
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="font-medium text-sm md:text-base">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-center p-6">
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
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Admin Access Required
            </h3>
            <p className="text-gray-500 text-sm">
              Please log in to access the admin panel
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
