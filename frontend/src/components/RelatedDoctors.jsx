import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import DoctorCard from "./DoctorCardHome";
import { useNavigate } from "react-router-dom";
import { getSpecialityName } from "../utils/formatters";

const RelatedDoctors = ({ docId, speciality }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(doctorsData);
    }
  }, [docId, speciality, doctors]);

  if (relDoc.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900">
      <h2 className="text-2xl sm:text-3xl font-bold">
        Bác Sĩ Cùng Chuyên Khoa ({getSpecialityName(speciality)})
      </h2>
      <p className="sm:w-1/2 text-center text-gray-600 text-sm">
        Tham khảo thêm các chuyên gia y tế khác cùng lĩnh vực để có sự lựa chọn phù hợp nhất.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
        {relDoc.slice(0, 4).map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>
      <button
        className="mt-6 px-8 py-2.5 border-2 border-[#5f6fff] text-[#5f6fff] font-medium rounded-full hover:bg-[#5f6fff] hover:text-white transition-all duration-300"
        onClick={() => {
          navigate(`/doctors/${speciality}`);
          scrollTo(0, 0);
        }}
      >
        Xem thêm bác sĩ {getSpecialityName(speciality)}
      </button>
    </div>
  );
};

export default RelatedDoctors;
