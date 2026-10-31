import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { token, userData, setUserData, backendURL, loadUserProfile } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userData && token) {
      loadUserProfile();
    }
  }, [userData, token]);

  const updateDataProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", userData.name || "");
      formData.append("phone", userData.phone || "");
      formData.append("address", JSON.stringify(userData.address || { line1: "", line2: "" }));
      formData.append("dob", userData.dob || "");
      formData.append("gender", userData.gender || "Nam");

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        `${backendURL}/api/user/update-profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message || "Cập nhật hồ sơ thành công");
        await loadUserProfile();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Không thể cập nhật hồ sơ, vui lòng thử lại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f6fff]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Hồ Sơ Cá Nhân
        </h1>
        <p className="text-gray-500 text-sm">
          Quản lý thông tin cá nhân và thông tin liên lạc để việc đặt lịch khám diễn ra thuận lợi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Ảnh đại diện & Tên */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs text-center">
            {isEdit ? (
              <label htmlFor="image" className="cursor-pointer group inline-block">
                <div className="relative inline-block">
                  <img
                    src={image ? URL.createObjectURL(image) : userData.image || assets.profile_pic}
                    alt="Ảnh đại diện"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-xs font-semibold">Đổi ảnh</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2">
                  Nhấp để chọn ảnh mới
                </p>
              </label>
            ) : (
              <img
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-md mx-auto"
                src={userData.image || assets.profile_pic}
                alt="Ảnh đại diện"
              />
            )}
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              accept="image/*"
            />

            <div className="mt-4">
              {isEdit ? (
                <input
                  className="text-xl font-bold text-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f6fff] w-full"
                  value={userData.name || ""}
                  type="text"
                  placeholder="Nhập họ và tên..."
                  onChange={(e) => {
                    setUserData((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
              )}
              <p className="text-gray-400 text-xs mt-1">Bệnh nhân hệ thống</p>
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin liên hệ & Cơ bản */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin liên hệ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📞</span> Thông tin liên hệ
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium w-28">Email:</span>
                <span className="text-gray-900 font-semibold">{userData.email}</span>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Đã xác thực
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100 gap-2">
                <span className="text-gray-500 font-medium w-28">Số điện thoại:</span>
                {isEdit ? (
                  <input
                    className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                    value={userData.phone || ""}
                    type="tel"
                    placeholder="Nhập số điện thoại..."
                    onChange={(e) => {
                      setUserData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                    }}
                  />
                ) : (
                  <span className="text-gray-900 font-medium">
                    {userData.phone || "Chưa cập nhật"}
                  </span>
                )}
              </div>

              <div className="py-2">
                <span className="text-gray-500 font-medium block mb-2">Địa chỉ:</span>
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev?.address, line1: e.target.value },
                        }))
                      }
                      value={userData?.address?.line1 || ""}
                      type="text"
                      placeholder="Số nhà, tên đường..."
                    />
                    <input
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev?.address, line2: e.target.value },
                        }))
                      }
                      value={userData?.address?.line2 || ""}
                      type="text"
                      placeholder="Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                    />
                  </div>
                ) : (
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p>{userData?.address?.line1 || "Chưa cập nhật địa chỉ đường"}</p>
                    {userData?.address?.line2 && (
                      <p className="text-xs text-gray-500 mt-1">{userData?.address?.line2}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👤</span> Thông tin cơ bản
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium w-28">Giới tính:</span>
                {isEdit ? (
                  <select
                    className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    value={userData.gender || "Nam"}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {userData.gender || "Chưa xác định"}
                  </span>
                )}
              </div>

              <div className="flex items-center py-2">
                <span className="text-gray-500 font-medium w-28">Ngày sinh:</span>
                {isEdit ? (
                  <input
                    className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                    type="date"
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    value={userData.dob || ""}
                  />
                ) : (
                  <span className="text-gray-900 font-medium">
                    {userData.dob || "Chưa cập nhật"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            {isEdit ? (
              <>
                <button
                  disabled={loading}
                  className="flex-1 bg-[#5f6fff] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#4d5de6] transition shadow-xs cursor-pointer"
                  onClick={updateDataProfile}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    setIsEdit(false);
                    setImage(false);
                  }}
                >
                  Hủy bỏ
                </button>
              </>
            ) : (
              <button
                className="bg-[#5f6fff] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#4d5de6] transition shadow-xs flex items-center gap-2 cursor-pointer"
                onClick={() => setIsEdit(true)}
              >
                <span>✏️</span> Chỉnh sửa hồ sơ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
