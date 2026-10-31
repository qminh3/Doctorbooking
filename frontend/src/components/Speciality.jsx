import React from "react";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";
import { getSpecialityName } from "../utils/formatters";

const Speciality = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
    >
      <h2 className="text-3xl font-bold text-gray-900">Tìm Kiếm Theo Chuyên Khoa</h2>
      <p className="sm:w-1/2 text-center text-gray-600 text-sm sm:text-base leading-relaxed">
        Lựa chọn chuyên khoa y tế phù hợp để kết nối với bác sĩ chuyên môn giỏi và nhận tư vấn khám bệnh tốt nhất.
      </p>
      <div className="flex sm:justify-center gap-4 sm:gap-6 pt-5 w-full overflow-x-auto pb-4 font-medium">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-center cursor-pointer flex-shrink-0 hover:translate-y-[-8px] transition-all duration-300 p-3 rounded-2xl hover:bg-blue-50/50"
            to={`/doctors/${item.speciality}`}
            key={index}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center mb-2.5 p-3 shadow-xs">
              <img className="w-full h-full object-contain" src={item.image} alt={item.speciality} />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 max-w-[100px]">
              {getSpecialityName(item.speciality)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Speciality;
