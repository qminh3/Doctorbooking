import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import DoctorCard from "./DoctorCardHome";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  const navigate = useNavigate();
  // Display related doctors here
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
  return (
    <div className=" flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className=" text-3xl font-semibold">Top Doctors to Book</h1>
      <p className=" sm:w-1/2 text-center text-xl ">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className=" w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 pt-5 gap-y-6 px-3 sm:px-0">
        {relDoc.slice(0, 5).map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>
      <button
        className="mt-6 px-10 py-2 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300"
        onClick={() => {
          navigate(`/doctors`);
          scrollTo(0, 0);
        }}
      >
        more
      </button>
    </div>
  );
};

export default RelatedDoctors;
