import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-[#5f6fff] rounded-2xl px-6 md:px-10 lg:px-20 shadow-md">
      {/* Left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[8vw] md:mb-[-20px]">
        <span className="bg-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full backdrop-blur-xs">
          ⭐ Nền tảng y tế số tin cậy hàng đầu
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight">
          Đặt Lịch Khám Bệnh <br />
          Cùng Bác Sĩ Uy Tín
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm">
          <img className="w-24 sm:w-28" src={assets.group_profiles} alt="Bệnh nhân tin cậy" />
          <p className="leading-relaxed">
            Duyệt danh sách hàng trăm bác sĩ chuyên khoa giàu kinh nghiệm, <br className="hidden sm:block" />
            chủ động chọn ngày giờ khám phù hợp và nhận tư vấn tận tâm.
          </p>
        </div>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white px-8 py-3.5 rounded-full text-gray-700 text-sm font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 mt-2"
        >
          Khám phá chuyên khoa ngay
          <img className="w-3" src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 relative flex items-end justify-center">
        <img
          className="w-full md:absolute bottom-0 h-auto max-h-[460px] object-contain"
          src={assets.header_img}
          alt="Bác sĩ uy tín"
        />
      </div>
    </div>
  );
};

export default Header;
