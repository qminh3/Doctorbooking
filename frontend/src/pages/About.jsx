import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div className="py-8">
      <div className="text-center pt-8 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">
          VỀ CHÚNG TÔI - <span className="text-[#5f6fff]">BOOKINGDOCTOR</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
          Đồng hành cùng sức khỏe gia đình bạn bằng giải pháp công nghệ kết nối y tế thông minh và tiện lợi.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
        <img
          src={assets.about_image}
          alt="Về BookingDoctor"
          className="w-full md:max-w-[400px] rounded-3xl shadow-lg border-4 border-white"
        />
        <div className="flex flex-col justify-center gap-6 md:w-3/5 text-base text-gray-700 bg-white rounded-2xl shadow-xs p-8 border border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Chào mừng bạn đến với <span className="text-[#5f6fff]">BookingDoctor</span>
            </h2>
            <p className="leading-relaxed text-gray-600 text-sm sm:text-base">
              BookingDoctor ra đời với sứ mệnh xóa bỏ rào cản xếp hàng, chờ đợi mệt mỏi tại các cơ sở y tế. Chúng tôi cung cấp giải pháp đặt lịch khám bệnh trực tuyến nhanh chóng, minh bạch và an toàn, giúp bệnh nhân kết nối trực tiếp với các bác sĩ đầu ngành trên khắp cả nước.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tầm Nhìn Của Chúng Tôi</h3>
            <p className="leading-relaxed text-gray-600 text-sm sm:text-base">
              Trở thành nền tảng chăm sóc sức khỏe số hàng đầu tại Việt Nam, mang dịch vụ y tế chất lượng cao đến mọi gia đình. Chúng tôi không ngừng nâng cao chất lượng dịch vụ, tối ưu hóa trải nghiệm người dùng và mở rộng mạng lưới y bác sĩ chuyên môn cao.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
            <div className="p-3 bg-blue-50/50 rounded-xl">
              <span className="text-2xl block mb-1">⏱️</span>
              <h4 className="font-bold text-gray-800 text-sm">Tiết kiệm thời gian</h4>
              <p className="text-xs text-gray-500 mt-0.5">Đặt lịch chỉ trong 1 phút</p>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-xl">
              <span className="text-2xl block mb-1">👨‍⚕️</span>
              <h4 className="font-bold text-gray-800 text-sm">Bác sĩ uy tín</h4>
              <p className="text-xs text-gray-500 mt-0.5">Nhiều năm kinh nghiệm</p>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-xl">
              <span className="text-2xl block mb-1">💳</span>
              <h4 className="font-bold text-gray-800 text-sm">Minh bạch chi phí</h4>
              <p className="text-xs text-gray-500 mt-0.5">Giá khám niêm yết rõ ràng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
