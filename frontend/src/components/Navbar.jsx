import React, { useState, useContext } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img
          onClick={() => {
            navigate(`/`);
            scrollTo(0, 0);
          }}
          src={assets.logo}
          alt="BookingDoctor Logo"
          className="w-40 sm:w-44 cursor-pointer"
        />
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6 font-medium text-gray-700">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `py-1 transition-colors hover:text-[#5f6fff] ${
              isActive ? "text-[#5f6fff] font-semibold border-b-2 border-[#5f6fff]" : ""
            }`
          }
        >
          TRANG CHỦ
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `py-1 transition-colors hover:text-[#5f6fff] ${
              isActive ? "text-[#5f6fff] font-semibold border-b-2 border-[#5f6fff]" : ""
            }`
          }
        >
          BÁC SĨ
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `py-1 transition-colors hover:text-[#5f6fff] ${
              isActive ? "text-[#5f6fff] font-semibold border-b-2 border-[#5f6fff]" : ""
            }`
          }
        >
          GIỚI THIỆU
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `py-1 transition-colors hover:text-[#5f6fff] ${
              isActive ? "text-[#5f6fff] font-semibold border-b-2 border-[#5f6fff]" : ""
            }`
          }
        >
          LIÊN HỆ
        </NavLink>
      </ul>

      {/* Right Action / Auth */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-3 cursor-pointer group relative">
            <img
              className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
              src={userData?.image || assets.profile_pic}
              alt={userData?.name || "Avatar"}
            />
            <span className="hidden sm:inline font-medium text-gray-700 text-sm">
              {userData?.name}
            </span>
            <img className="w-2.5 opacity-60" src={assets.dropdown_icon} alt="" />

            {/* Dropdown Menu */}
            <div className="absolute top-0 right-0 pt-14 text-sm font-medium text-gray-700 z-30 hidden group-hover:block">
              <div className="min-w-52 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col p-2 space-y-1">
                <button
                  onClick={() => navigate("/my-profile")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-left transition"
                >
                  <span>👤</span> Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => navigate("/my-appointments")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-left transition"
                >
                  <span>📅</span> Lịch hẹn của tôi
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-600 text-left transition"
                >
                  <span>🚪</span> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6fff] hover:bg-[#4a5aec] text-white px-6 sm:px-8 py-2.5 rounded-full cursor-pointer font-medium shadow-sm transition-all"
          >
            Đăng nhập / Đăng ký
          </button>
        )}

        {/* Mobile menu hamburger icon */}
        <button
          onClick={() => setShowMobileMenu(true)}
          className="w-7 md:hidden flex items-center justify-center p-1 text-gray-600 hover:text-gray-900"
        >
          <img src={assets.menu_icon} alt="Menu" className="w-6" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end md:hidden">
          <div className="w-3/4 max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <img src={assets.logo} alt="Logo" className="w-36" />
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <img src={assets.cross_icon} alt="Close" className="w-4" />
                </button>
              </div>
              <ul className="flex flex-col gap-4 mt-6 text-base font-medium text-gray-700">
                <NavLink
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#5f6fff]"
                >
                  Trang chủ
                </NavLink>
                <NavLink
                  to="/doctors"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#5f6fff]"
                >
                  Danh sách Bác sĩ
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#5f6fff]"
                >
                  Giới thiệu
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#5f6fff]"
                >
                  Liên hệ
                </NavLink>
                {token && (
                  <>
                    <hr className="my-2" />
                    <NavLink
                      to="/my-profile"
                      onClick={() => setShowMobileMenu(false)}
                      className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#5f6fff]"
                    >
                      Hồ sơ cá nhân
                    </NavLink>
                    <NavLink
                      to="/my-appointments"
                      onClick={() => setShowMobileMenu(false)}
                      className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#5f6fff]"
                    >
                      Lịch hẹn của tôi
                    </NavLink>
                  </>
                )}
              </ul>
            </div>

            {token ? (
              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50"
              >
                Đăng xuất
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMobileMenu(false);
                }}
                className="w-full py-2.5 bg-[#5f6fff] text-white rounded-xl font-medium"
              >
                Đăng nhập ngay
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
