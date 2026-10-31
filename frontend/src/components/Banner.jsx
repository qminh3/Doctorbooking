import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex bg-[#5f6fff] rounded-2xl px-6 sm:px-10 md:px-14 lg:px-12 my-16 shadow-md overflow-hidden relative">
      {/* Left side */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-20 lg:pl-5 z-10">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
          <p>Đặt Lịch Khám Ngay Hôm Nay</p>
          <p className="mt-3 text-indigo-100 font-medium text-lg sm:text-xl">
            Kết nối với hơn 100+ Bác sĩ chuyên khoa đầu ngành
          </p>
        </div>
        <p className="text-white/80 text-sm mt-3 max-w-lg">
          Không cần xếp hàng chờ đợi. Đặt lịch khám trực tuyến nhanh chóng, bảo mật thông tin và quản lý hồ sơ sức khỏe thông minh.
        </p>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-800 font-semibold mt-6 px-8 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all"
        >
          Đăng ký tài khoản miễn phí
        </button>
      </div>

      {/* Right side */}
      <div className="hidden md:block md:w-1/2 lg:w-[360px] relative">
        <img
          className="w-full absolute bottom-0 right-10 h-auto max-w-sm object-contain"
          src={assets.appointment_img}
          alt="Đặt lịch hẹn khám"
        />
      </div>
    </div>
  );
};

export default Banner;
