import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../components/DoctorCardHome";
import { specialityMap } from "../utils/formatters";

const Doctor = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const specialtiesList = [
    { key: "General physician", name: "Bác sĩ Đa khoa" },
    { key: "Gynecologist", name: "Sản phụ khoa" },
    { key: "Dermatologist", name: "Da liễu" },
    { key: "Pediatricians", name: "Nhi khoa" },
    { key: "Neurologist", name: "Thần kinh" },
    { key: "Gastroenterologist", name: "Tiêu hóa" },
  ];

  const applyFilter = () => {
    let result = [...doctors];
    if (speciality) {
      result = result.filter((doctor) => doctor.speciality === speciality);
    }
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(keyword) ||
          (specialityMap[doc.speciality] || "").toLowerCase().includes(keyword) ||
          doc.speciality.toLowerCase().includes(keyword)
      );
    }
    setFilterDoc(result);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, searchKeyword]);

  return (
    <div className="py-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Danh Sách Bác Sĩ Chuyên Khoa
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tìm kiếm và lựa chọn bác sĩ phù hợp với nhu cầu thăm khám của bạn.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo tên bác sĩ..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white transition"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Side: Chuyên khoa filters */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <span className="font-bold text-gray-800 text-sm">Chuyên khoa</span>
            {speciality && (
              <button
                onClick={() => navigate("/doctors")}
                className="text-xs text-[#5f6fff] hover:underline font-medium"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2">
            <button
              onClick={() => navigate("/doctors")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                !speciality
                  ? "bg-[#5f6fff] text-white shadow-xs"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              🌟 Tất cả chuyên khoa
            </button>
            {specialtiesList.map((item) => {
              const isActive = speciality === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() =>
                    isActive ? navigate("/doctors") : navigate(`/doctors/${item.key}`)
                  }
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-[#5f6fff] text-white shadow-xs"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Doctor List */}
        <div className="flex-1 w-full">
          <div className="mb-4 text-xs sm:text-sm text-gray-500 font-medium flex items-center justify-between">
            <span>
              Tìm thấy <strong className="text-gray-900">{filterDoc.length}</strong> bác sĩ phù hợp
            </span>
            {speciality && (
              <span className="bg-blue-50 text-[#5f6fff] px-3 py-1 rounded-full text-xs font-semibold">
                Đang lọc: {specialityMap[speciality] || speciality}
              </span>
            )}
          </div>

          {filterDoc.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <span className="text-4xl block mb-2">🔍</span>
              <h3 className="text-base font-bold text-gray-700">Không tìm thấy bác sĩ nào</h3>
              <p className="text-gray-500 text-sm mt-1">
                Hãy thử tìm kiếm với từ khóa khác hoặc chọn chuyên khoa khác.
              </p>
              <button
                onClick={() => {
                  setSearchKeyword("");
                  navigate("/doctors");
                }}
                className="mt-4 px-5 py-2 bg-[#5f6fff] text-white text-xs font-semibold rounded-lg"
              >
                Xem tất cả bác sĩ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filterDoc.map((item, index) => (
                <DoctorCard key={index} doctor={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctor;
