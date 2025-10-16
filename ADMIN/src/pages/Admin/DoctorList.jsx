import React, { useState } from "react";
import { Admincontext } from "../../context/AdminContext";
import { useEffect, useContext } from "react";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(Admincontext);
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
          doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-lg">👨‍⚕️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">All Doctors</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
            value={filterSpeciality}
            onChange={(e) => setFilterSpeciality(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialities.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 text-sm">
          Showing{" "}
          <span className="font-semibold">{filteredDoctors.length}</span> of{" "}
          <span className="font-semibold">{doctors?.length || 0}</span> doctors
        </p>
      </div>

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
        {filteredDoctors && filteredDoctors.length > 0 ? (
          filteredDoctors.map((item, index) => (
            <div
              key={index}
              className="
    group relative w-full overflow-hidden rounded-2xl border border-gray-100
    bg-white shadow-sm transition-all duration-500
    hover:-translate-y-1 hover:shadow-xl focus-within:shadow-xl
  "
              tabIndex={0}
            >
              <div className="relative">
                <div className="h-28 w-full bg-gradient-to-r from-indigo-50 via-sky-50 to-purple-50" />
                <div className="absolute inset-x-0 -bottom-16 flex justify-center">
                  <div className="relative h-40 w-40 rounded-full ring-4 ring-white overflow-hidden shadow-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 pt-20 pb-5">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {item.name}
                  </h3>
                </div>

                <div className="mb-4 text-center">
                  <span className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
                    {item.speciality}
                  </span>
                </div>

                <div className="mb-4 flex justify-center">
                  <button
                    onClick={() => changeAvailability(item._id)}
                    className={`
                         overflow-hidden px-6 py-2.5 rounded-lg font-medium text-sm
                        transition-all duration-300 transform hover:scale-105
                        focus:outline-none 
                        ${
                          item.available
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25"
                            : "bg-green-500 hover:bg-green-600 text-white  shadow-lg hover:shadow-green-500/25"
                        }
                      `}
                  >
                    {item.available ? "X" : "O"}
                  </button>
                  <span
                    className={`
          inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium
          ${
            item.available
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }
        `}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        item.available ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {item.experience && (
                  <p className="text-center text-sm text-gray-500">
                    Experience:{" "}
                    <span className="font-medium text-gray-700">
                      {item.experience}
                    </span>
                  </p>
                )}
              </div>

              <span
                className="
      pointer-events-none absolute inset-0 rounded-2xl
      ring-1 ring-transparent transition group-hover:ring-indigo-200
    "
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterSpeciality("");
                setFilterAvailability("all");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
