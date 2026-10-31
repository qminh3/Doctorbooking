import React, { useContext, useState } from "react";
import { Admincontext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin"); // "Admin" hoặc "Doctor"
  const { setAToken, backendUrl } = useContext(Admincontext);
  const { setDToken } = useContext(DoctorContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.warn("Vui lòng nhập đầy đủ email và mật khẩu");
    }

    setIsLoading(true);
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Đăng nhập Quản trị viên thành công!");
        } else {
          toast.error(data.message || "Đăng nhập thất bại");
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Đăng nhập Bác sĩ thành công!");
        } else {
          toast.error(data.message || "Đăng nhập thất bại");
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      const msg = error?.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5f6fff] text-white rounded-2xl mb-3 shadow-md text-2xl">
            🩺
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Hệ Thống Quản Trị & Bác Sĩ
          </h1>
          <p className="text-gray-500 text-sm">
            Đăng nhập với vai trò{" "}
            <span className="text-[#5f6fff] font-bold">
              {state === "Admin" ? "Quản trị viên" : "Bác sĩ phụ trách"}
            </span>
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setState("Admin")}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              state === "Admin"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Quản trị viên
          </button>
          <button
            type="button"
            onClick={() => setState("Doctor")}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              state === "Doctor"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Bác sĩ
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Địa chỉ Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@bookingdoctor.vn"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5f6fff] hover:bg-[#4d5de6] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer mt-2 disabled:bg-gray-400"
          >
            {isLoading
              ? "Đang xác thực..."
              : `Đăng nhập ${state === "Admin" ? "Quản Trị Viên" : "Bác Sĩ"}`}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          BookingDoctor • Nền tảng quản lý phòng khám trực tuyến
        </div>
      </div>
    </div>
  );
};

export default Login;
