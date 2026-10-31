import React, { useContext } from "react";
import DoctorCard from "./DoctorCardHome";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-6">
      <h2 className="text-3xl font-bold text-gray-900">Bác Sĩ Tiêu Biểu</h2>
      <p className="sm:w-1/2 text-center text-gray-600 text-sm sm:text-base">
        Khám phá và đặt hẹn nhanh chóng với các chuyên gia y tế uy tín, nhiều năm kinh nghiệm.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {doctors.slice(0, 8).map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>

      <button
        className="mt-8 px-8 py-3 border-2 border-[#5f6fff] text-[#5f6fff] font-semibold rounded-full hover:bg-[#5f6fff] hover:text-white transition-all duration-300 shadow-xs cursor-pointer"
        onClick={() => {
          navigate(`/doctors`);
          scrollTo(0, 0);
        }}
      >
        Xem tất cả bác sĩ ({doctors.length})
      </button>
    </div>
  );
};

export default TopDoctors;
