import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-28 border-t border-gray-200 pt-12 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-sm text-gray-600">
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="md:col-span-2 space-y-4">
          <img src={assets.logo} alt="BookingDoctor" className="w-44 h-auto" />
          <p className="leading-relaxed text-gray-500 max-w-md">
            BookingDoctor là nền tảng công nghệ y tế hiện đại, kết nối bệnh nhân trực tiếp với các chuyên gia, bác sĩ hàng đầu tại Việt Nam. Đặt lịch khám nhanh chóng, minh bạch chi phí và an tâm chăm sóc sức khỏe.
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              ✔ Bộ Y Tế chứng nhận
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              🔒 Bảo mật thông tin bệnh án
            </span>
          </div>
        </div>

        {/* Cột 2: Điều hướng */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-4">VỀ HỆ THỐNG</h3>
          <ul className="space-y-2.5">
            <li>
              <Link to="/" className="hover:text-[#5f6fff] transition">Trang chủ</Link>
            </li>
            <li>
              <Link to="/doctors" className="hover:text-[#5f6fff] transition">Danh sách bác sĩ</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#5f6fff] transition">Giới thiệu nền tảng</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#5f6fff] transition">Liên hệ & Hỗ trợ</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ khách hàng */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-4">LIÊN HỆ TRỢ GIÚP</h3>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Tổng đài:</span>
              <span className="text-[#5f6fff] font-bold">1900 6868</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Email:</span>
              <a href="mailto:support@bookingdoctor.vn" className="text-blue-600 hover:underline">
                support@bookingdoctor.vn
              </a>
            </li>
            <li>
              <span className="font-semibold text-gray-700">Địa chỉ:</span> Tòa nhà Y Tế Số, Quận Cầu Giấy, Hà Nội
            </li>
            <li>
              <span className="font-semibold text-gray-700">Thời gian làm việc:</span> 08:00 - 21:00 (Hàng ngày)
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <p>© 2026 BookingDoctor. Tất cả quyền được bảo lưu.</p>
        <p>Hệ thống đặt lịch khám bệnh trực tuyến chuẩn hóa tại Việt Nam</p>
      </div>
    </footer>
  );
};

export default Footer;
