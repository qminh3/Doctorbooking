import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../components/DoctorCardHome";

const Doctor = () => {
  const { speciality } = useParams();

  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter((doctor) => doctor.speciality === speciality)
      );
    } else {
      setFilterDoc(doctors);
    }
  };
  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);
  return (
    <div>
      <p className=" text-gray-600">Browse through the doctors specialist.</p>
      <div className=" flex flex-col sm:flex-row items-start gap-5 mt-10 ">
        <div className=" flex flex-col gap-4 text-gray-700">
          <p
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1 pr-16 border border-gray-400 rounded-xl transition-all cursor-pointer 
              ${
                speciality === "General physician"
                  ? "bg-[#5f6fff] text-white"
                  : ""
              }`}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1 pr-16 border border-gray-400 rounded-xl transition-all cursor-pointer
               ${
                 speciality === "Gynecologist" ? "bg-[#5f6fff] text-white" : ""
               }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1 pr-16 border border-gray-400 rounded-xl transition-all cursor-pointer
              ${
                speciality === "Dermatologist" ? "bg-[#5f6fff] text-white" : ""
              }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatricians")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1 pr-16 border border-gray-400 rounded-xl transition-all cursor-pointer
               ${
                 speciality === "Pediatricians" ? "bg-[#5f6fff] text-white" : ""
               }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1 pr-16 border border-gray-400 rounded-xl transition-all 
               ${
                 speciality === "Neurologist" ? "bg-[#5f6fff] text-white" : ""
               } cursor-pointer`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1 pr-16 border 
               ${
                 speciality === "Gastroenterologist"
                   ? "bg-[#5f6fff] text-white"
                   : ""
               } border-gray-400 rounded-xl transition-all cursor-pointer`}
          >
            Gastroenterologist
          </p>
        </div>
        <div className=" w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 gap-y-6">
          {filterDoc.map((item, index) => (
            <DoctorCard key={index} doctor={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctor;
