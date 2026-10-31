import React, { useState, useEffect, useContext } from "react";
import { Admincontext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(Admincontext);
  const { getSpecialityName, formatCurrency } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const specialities = doctors
    ? [...new Set(doctors.map((doctor) => doctor.speciality))]
    : [];

  const filteredDoctors = doctors
    ? doctors.filter((doctor) => {
        const matchesSearch =
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getSpecialityName(doctor.speciality).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpeciality =
          !filterSpeciality || doctor.speciality === filterSpeciality;
        const matchesAvailability =
          filterAvailability === "all" ||
          (filterAvailability === "available" && doctor.available) ||
          (filterAvailability === "unavailable" && !doctor.available);

        return matchesSearch && matchesSpeciality && matchesAvailability;
      })
    : [];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Danh Sách Bác Sĩ Trong Hệ Thống
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý thông tin và bật/tắt trạng thái nhận lịch khám của các bác sĩ.
          </p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Tổng bác sĩ:</span>
          <span className="text-base font-bold text-blue-600">{doctors?.length || 0}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 mb-6 shadow-xs border border-gray-200 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm bác sĩ theo tên hoặc chuyên khoa..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        <select
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5f6fff] min-w-[200px]"
          value={filterSpeciality}
          onChange={(e) => setFilterSpeciality(e.target.value)}
        >
          <option value="">🌟 Tất cả chuyên khoa</option>
          {specialities.map((specialty) => (
            <option key={specialty} value={specialty}>
              {getSpecialityName(specialty)}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5f6fff] min-w-[170px]"
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
        >
          <option value="all">🌟 Tất cả trạng thái</option>
          <option value="available">🟢 Đang nhận lịch</option>
          <option value="unavailable">🔴 Tạm ngưng nhận</option>
        </select>
      </div>

      {/* Grid Danh Sách Bác Sĩ */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDoctors && filteredDoctors.length > 0 ? (
          filteredDoctors.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-gradient-to-b from-blue-50 to-indigo-50/30 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                        item.available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.available ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        }`}
                      ></span>
                      {item.available ? "Đang nhận lịch" : "Tạm ngưng"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1.5">
                    {getSpecialityName(item.speciality)}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.degree} • {item.experience}
                  </p>
                  <p className="text-xs text-gray-700 font-semibold mt-2">
                    Phí khám: <span className="text-[#5f6fff]">{formatCurrency(item.fees)}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                <button
                  onClick={() => changeAvailability(item._id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-3 ${
                    item.available
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span>{item.available ? "⏸️ Tạm ngưng nhận lịch" : "▶️ Bật nhận lịch khám"}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl block mb-2">👨‍⚕️</span>
            <p className="text-gray-600 font-bold">Không tìm thấy bác sĩ nào</p>
            <p className="text-gray-400 text-xs mt-1">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
