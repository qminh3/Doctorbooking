import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div className="py-8">
      <div className="text-center pt-8 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">
          LIÊN HỆ VỚI <span className="text-[#5f6fff]">CHÚNG TÔI</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
          Đội ngũ hỗ trợ của BookingDoctor luôn sẵn sàng giải đáp thắc mắc và hỗ trợ bạn 24/7.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto items-center">
        <img
          className="w-full md:max-w-[400px] rounded-3xl shadow-lg border-4 border-white"
          src={assets.contact_image}
          alt="Liên hệ BookingDoctor"
        />
        <div className="flex flex-col justify-center items-start gap-6 md:w-3/5 text-sm text-gray-600 bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
          <div>
            <h2 className="text-gray-900 text-xl font-bold mb-3 flex items-center gap-2">
              <span>🏢</span> Trụ Sở Chính
            </h2>
            <p className="text-gray-700">Tòa nhà Trung Tâm Đổi Mới Sáng Tạo Y Tế</p>
            <p className="text-gray-500 mt-1">Phố Duy Tân, Quận Cầu Giấy, TP. Hà Nội, Việt Nam</p>
          </div>

          <div className="w-full border-t border-gray-100 pt-4 space-y-2">
            <h3 className="text-gray-900 text-base font-bold mb-2">Kênh Hỗ Trợ Trực Tuyến</h3>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Tổng đài CSKH:</span>
              <a href="tel:19006868" className="text-[#5f6fff] font-bold text-base hover:underline">
                1900 6868 (08:00 - 21:00)
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Email hỗ trợ:</span>
              <a
                href="mailto:support@bookingdoctor.vn"
                className="text-blue-600 hover:underline"
              >
                support@bookingdoctor.vn
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Hợp tác phòng khám & Bác sĩ:</span>
              <a
                href="mailto:partner@bookingdoctor.vn"
                className="text-blue-600 hover:underline"
              >
                partner@bookingdoctor.vn
              </a>
            </p>
          </div>

          <div className="w-full border-t border-gray-100 pt-4">
            <h3 className="text-gray-900 text-base font-bold mb-1">
              Cơ Hội Nghề Nghiệp tại BookingDoctor
            </h3>
            <p className="text-gray-500 text-xs mb-3">
              Gia nhập đội ngũ tài năng của chúng tôi để cùng phát triển nền tảng y tế số tiên tiến.
            </p>
            <button className="border-2 border-[#5f6fff] text-[#5f6fff] hover:bg-[#5f6fff] hover:text-white px-5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer">
              Khám phá vị trí tuyển dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
