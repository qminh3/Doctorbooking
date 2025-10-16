import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { token, userData, setUserData, backendURL, loadUserProfile } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  useEffect(() => {
    if (!userData && token) {
      loadUserProfile();
    }
  }, [userData, token]);

  const updateDataProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);

      image && formData.append("image", image);

      const { data } = await axios.post(
        `${backendURL}/api/user/update-profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfile();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong in updating profile");
      console.log(error);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-blue-100 p-6 rounded-xl shadow-sm">
            <div className="text-center">
              {isEdit ? (
                <label htmlFor="image" className="cursor-pointer group">
                  <div className="relative inline-block cursor-pointer">
                    <img
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt="Profile"
                      className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                      <img
                        src={assets.upload_icon}
                        alt="Upload"
                        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Click to change photo
                  </p>
                </label>
              ) : (
                <img
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                  src={userData.image}
                  alt="Profile"
                />
              )}
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                accept="image/*"
              />
            </div>

            <div className="mt-6 text-center">
              {isEdit ? (
                <input
                  className="text-2xl font-bold text-center bg-white rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={userData.name || ""}
                  type="text"
                  placeholder="Enter your name"
                  onChange={(e) => {
                    setUserData((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">
                  {userData.name}
                </h2>
              )}
              <p className="text-gray-600 mt-1">
                @{userData.email?.split("@")[0]}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Contact Information
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-20">Email:</span>
                  <span className="text-blue-600 font-medium">
                    {userData.email}
                  </span>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>

              <div className="flex items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium w-20">Phone:</span>
                {isEdit ? (
                  <input
                    className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.phone || ""}
                    type="tel"
                    placeholder="Enter phone number"
                    onChange={(e) => {
                      setUserData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                    }}
                  />
                ) : (
                  <span className="text-gray-800">
                    {userData.phone || "Not provided"}
                  </span>
                )}
              </div>

              <div className="py-3">
                <span className="text-gray-600 font-medium block mb-2">
                  Address:
                </span>
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      className="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev?.address, line1: e.target.value },
                        }))
                      }
                      value={userData?.address?.line1 || ""}
                      type="text"
                      placeholder="Street address"
                    />
                    <input
                      className="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev?.address, line2: e.target.value },
                        }))
                      }
                      value={userData?.address?.line2 || ""}
                      type="text"
                      placeholder="City, State, ZIP"
                    />
                  </div>
                ) : (
                  <div className="text-gray-800">
                    <p>
                      {userData?.address?.line1 ||
                        "Street address not provided"}
                    </p>
                    <p>
                      {userData?.address?.line2 ||
                        "City, State, ZIP not provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Basic Information
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium w-24">Gender:</span>
                {isEdit ? (
                  <select
                    className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    value={userData.gender || ""}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <span className="text-gray-800">
                    {userData.gender || "Not specified"}
                  </span>
                )}
              </div>

              <div className="flex items-center py-3">
                <span className="text-gray-600 font-medium w-24">
                  Birthday:
                </span>
                {isEdit ? (
                  <input
                    className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="date"
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    value={userData.dob || ""}
                  />
                ) : (
                  <span className="text-gray-800">
                    {userData.dob
                      ? new Date(userData.dob).toLocaleDateString()
                      : "Not provided"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {isEdit ? (
              <>
                <button
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={updateDataProfile}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Save Changes
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    setIsEdit(false);
                    setImage(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                onClick={() => setIsEdit(true)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
