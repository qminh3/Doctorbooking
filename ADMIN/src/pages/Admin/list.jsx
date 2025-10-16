import React, { useState } from "react";
import { Admincontext } from "../../context/AdminContext";
import { useEffect, useContext } from "react";
import { Search, Filter, Star, Phone, Mail, MapPin } from "lucide-react";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors } = useContext(Admincontext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  // Get unique specialities for filter
  const specialities = doctors
    ? [...new Set(doctors.map((doctor) => doctor.speciality))]
    : [];

  // Filter doctors based on search and filters
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
    <div className="min-h-[90vh]  overflow-y-scroll p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">👨‍⚕️</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              All Doctors
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage and view all registered doctors in the system
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm min-w-[200px]"
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
            </div>

            {/* Availability Filter */}
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm min-w-[150px]"
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Busy</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
            Showing{" "}
            <span className="font-semibold text-blue-600">
              {filteredDoctors.length}
            </span>{" "}
            of <span className="font-semibold">{doctors?.length || 0}</span>{" "}
            doctors
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((item, index) => (
              <div
                key={index}
                className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white/90"
              >
                {/* Image Container với overlay effect */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover bg-gradient-to-br from-blue-50 to-purple-50 group-hover:scale-110 transition-all duration-500"
                  />
                  {/* Availability indicator */}
                  <div
                    className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      item.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Name and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center text-yellow-500">
                      <Star size={14} className="fill-current" />
                      <span className="text-xs text-gray-500 ml-1">4.8</span>
                    </div>
                  </div>

                  {/* Specialty */}
                  <p className="text-blue-600 font-medium text-sm mb-3 bg-blue-50 px-2 py-1 rounded-lg inline-block">
                    {item.speciality}
                  </p>

                  {/* Contact Info (if available) */}
                  {item.phone && (
                    <div className="flex items-center text-gray-600 text-xs mb-2">
                      <Phone size={12} className="mr-2" />
                      <span>{item.phone}</span>
                    </div>
                  )}

                  {item.email && (
                    <div className="flex items-center text-gray-600 text-xs mb-3">
                      <Mail size={12} className="mr-2" />
                      <span className="truncate">{item.email}</span>
                    </div>
                  )}

                  {/* Availability Status */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.available ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          item.available ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {item.available ? "Available" : "Busy"}
                      </span>
                    </div>

                    {/* Action button */}
                    <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                      View Details
                    </button>
                  </div>

                  {/* Experience or additional info if available */}
                  {item.experience && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Experience: {item.experience}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
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
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
