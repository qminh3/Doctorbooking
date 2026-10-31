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
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  aToken
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    aToken ? "bg-blue-500" : "bg-emerald-500"
                  } animate-pulse`}
                ></span>
                {userRoleTitle} Panel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span>Trạng thái:</span>
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Đang trực tuyến
              </span>
            </div>

            <button
              onClick={logout}
              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-red-200"
            >
              <span>🚪</span>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
