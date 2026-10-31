import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendURL, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Login"); // Mặc định là Login
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === "Sign Up") {
        if (!name.trim()) {
          toast.warn("Vui lòng nhập họ và tên của bạn");
          setLoading(false);
          return;
        }
        const { data } = await axios.post(`${backendURL}/api/user/register`, {
          name,
          email,
          password,
        });
        if (data?.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message || "Đăng ký tài khoản thành công!");
        } else {
          toast.error(data.message || "Đăng ký không thành công");
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/user/login`, {
          email,
          password,
        });
        if (data?.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message || "Đăng nhập thành công!");
        } else {
          toast.error(data.message || "Thông tin đăng nhập không chính xác");
        }
      }
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.message || "Đã xảy ra lỗi kết nối máy chủ";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10 flex flex-col gap-5 border border-gray-100"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {state === "Sign Up" ? "Tạo Tài Khoản Mới" : "Đăng Nhập"}
          </h1>
          <p className="text-gray-500 text-sm">
            {state === "Sign Up"
              ? "Đăng ký ngay để đặt lịch khám bệnh trực tuyến dễ dàng"
              : "Chào mừng bạn quay lại với hệ thống BookingDoctor"}
          </p>
        </div>

        {state === "Sign Up" && (
          <div className="w-full">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Họ và tên
            </label>
            <input
              className="border border-gray-300 rounded-xl w-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] transition"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Ví dụ: Nguyễn Văn A"
              autoComplete="name"
              required
            />
          </div>
        )}

        <div className="w-full">
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Địa chỉ Email
          </label>
          <input
            className="border border-gray-300 rounded-xl w-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] transition"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="example@gmail.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              className="border border-gray-300 rounded-xl w-full p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] transition"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder={state === "Sign Up" ? "Tối thiểu 8 ký tự" : "Nhập mật khẩu của bạn"}
              autoComplete={
                state === "Sign Up" ? "new-password" : "current-password"
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#5f6fff] hover:bg-[#4d5de6] text-white w-full py-3.5 rounded-xl text-sm font-semibold mt-2 shadow-md transition duration-200 cursor-pointer disabled:bg-gray-400"
        >
          {loading
            ? "Đang xử lý..."
            : state === "Sign Up"
            ? "Đăng Ký Tài Khoản"
            : "Đăng Nhập Ngay"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-2">
          {state === "Sign Up" ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <span
            onClick={() => {
              setState(state === "Sign Up" ? "Login" : "Sign Up");
            }}
            className="text-[#5f6fff] font-bold cursor-pointer hover:underline"
          >
            {state === "Sign Up" ? "Đăng nhập ngay" : "Tạo tài khoản mới"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
