import React from "react";
import { useNavigate } from "react-router-dom";
import { getSpecialityName, formatCurrency } from "../utils/formatters";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/appointment/${doctor._id}`);
        scrollTo(0, 0);
      }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative bg-gradient-to-b from-blue-50 to-indigo-50/40 aspect-4/3 overflow-hidden flex items-end justify-center">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={doctor.image}
          alt={doctor.name}
        />
        {/* Availability badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              doctor.available ? "bg-emerald-500 animate-pulse" : "bg-rose-400"
            }`}
          ></span>
          <span className={doctor.available ? "text-emerald-700" : "text-rose-600"}>
            {doctor.available ? "Sẵn sàng khám" : "Tạm ngưng"}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 inline-block mb-1.5">
            {getSpecialityName(doctor.speciality)}
          </span>
          <h3 className="text-gray-900 text-base font-bold group-hover:text-[#5f6fff] transition-colors line-clamp-1">
            {doctor.name}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">
            {doctor.degree} • {doctor.experience}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 block">Giá khám:</span>
            <span className="text-sm font-bold text-blue-600">
              {formatCurrency(doctor.fees)}
            </span>
          </div>
          <button className="text-xs font-semibold text-[#5f6fff] group-hover:translate-x-1 transition-transform">
            Đặt lịch &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
