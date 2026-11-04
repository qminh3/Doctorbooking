import React, { useContext } from "react";
import { assets } from "../assets/assets_admin/assets";
import { Admincontext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(Admincontext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    window.location.reload();
  };

  const userRoleTitle = aToken ? "Quản Trị Viên" : "Bác Sĩ";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img
                onClick={() => navigate("/")}
                className="h-8 w-auto cursor-pointer transition-transform hover:scale-105"
                src={assets.admin_logo}
                alt="BookingDoctor Admin"
              />
            </div>

            <div className="flex items-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f0f3ff] text-[#5f6fff] border border-[#d6e0ff]">
                <span className="w-1.5 h-1.5 rounded-full mr-2 bg-[#5f6fff]"></span>
                {userRoleTitle} Panel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 text-xs font-medium px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
