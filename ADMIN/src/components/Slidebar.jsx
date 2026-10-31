import React, { useContext } from "react";
import { Admincontext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";

const Sidebar = () => {
  const { aToken } = useContext(Admincontext);
  const { dToken } = useContext(DoctorContext);

  const adminNavItems = [
    {
      to: "/admin-dashboard",
      icon: assets.home_icon,
      label: "Tổng quan",
    },
    {
      to: "/all-appointment",
      icon: assets.appointment_icon,
      label: "Tất cả lịch hẹn",
    },
    {
      to: "/add-doctor",
      icon: assets.add_icon,
      label: "Thêm bác sĩ",
    },
    {
      to: "/doctor-list",
      icon: assets.people_icon,
      label: "Danh sách bác sĩ",
    },
  ];

  const doctorNavItems = [
    {
      to: "/doctor-dashboard",
      icon: assets.home_icon,
      label: "Tổng quan",
    },
    {
      to: "/doctor-appointment",
      icon: assets.appointment_icon,
      label: "Lịch khám bệnh",
    },
    {
      to: "/doctor-profile",
      icon: assets.people_icon,
      label: "Hồ sơ cá nhân",
    },
  ];

  const navItems = aToken ? adminNavItems : doctorNavItems;

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-xs flex-shrink-0">
      <nav className="p-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          {aToken ? "Menu Quản Trị" : "Menu Bác Sĩ"}
        </p>
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 py-3 px-4 rounded-xl transition-all font-medium text-sm ${
                    isActive
                      ? aToken
                        ? "bg-blue-50 text-blue-700 shadow-xs font-semibold"
                        : "bg-emerald-50 text-emerald-700 shadow-xs font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 flex-shrink-0 opacity-80"
                />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
