import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { profileData, setProfileData, getProfileData, dToken } =
    useContext(DoctorContext);
  const { backendUrl, formatCurrency, getSpecialityName } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateProfile = async () => {
    try {
      setSaving(true);
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Cập nhật hồ sơ bác sĩ thành công!");
        setIsEditing(false);
        getProfileData();
      } else {
        toast.error(data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    getProfileData();
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Hồ Sơ Cá Nhân Bác Sĩ
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý thông tin biểu phí, địa chỉ phòng khám và trạng thái tiếp nhận bệnh nhân.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Avatar & Thông tin cơ bản */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 text-center">
              <div className="relative inline-block mx-auto mb-4">
                <img
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-50 shadow-md bg-blue-50"
                  src={profileData?.image}
                  alt={profileData?.name}
                />
                <span
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                    profileData?.available ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  title={profileData?.available ? "Đang nhận lịch" : "Tạm ngưng nhận lịch"}
                ></span>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {profileData?.name}
              </h2>
              <p className="text-[#5f6fff] font-semibold text-sm mt-1">
                {getSpecialityName(profileData?.speciality)}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                  Học vị: {profileData?.degree}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  {profileData?.experience}
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Trạng thái hiện tại:</span>
                <span
                  className={`px-2.5 py-1 rounded-full font-bold ${
                    profileData?.available
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {profileData?.available ? "🟢 Đang nhận lịch" : "🔴 Tạm ngưng nhận"}
                </span>
              </div>
            </div>
          </div>

          {/* Cột phải: Cài đặt và cập nhật */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚙️</span> Cài Đặt Khám & Phòng Khám
              </h3>

              <div className="space-y-4 text-sm">
                {/* Phí khám */}
                <div className="py-2 border-b border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Giá khám niêm yết (VNĐ):
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profileData?.fees || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          fees: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                    />
                  ) : (
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(profileData?.fees)}
                    </p>
                  )}
                </div>

                {/* Trạng thái sẵn sàng */}
                <div className="py-2 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      Sẵn sàng nhận lịch khám bệnh
                    </p>
                    <p className="text-xs text-gray-400">
                      Bật để cho phép bệnh nhân nhìn thấy và đặt ca khám mới.
                    </p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={profileData?.available}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          available: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 accent-[#5f6fff] cursor-pointer"
                    />
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        profileData?.available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {profileData?.available ? "Đang Bật" : "Đang Tắt"}
                    </span>
                  )}
                </div>

                {/* Địa chỉ phòng khám */}
                <div className="py-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Địa chỉ tiếp nhận bệnh nhân:
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={profileData?.address?.line1 || ""}
                        placeholder="Số nhà, tên đường..."
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                      />
                      <input
                        type="text"
                        value={profileData?.address?.line2 || ""}
                        placeholder="Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800">
                      <p>{profileData?.address?.line1 || "Chưa cập nhật địa chỉ đường"}</p>
                      {profileData?.address?.line2 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {profileData?.address?.line2}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Giới thiệu */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tiểu sử bác sĩ & quá trình đào tạo:
                  </label>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {profileData?.about || "Chưa có thông tin giới thiệu."}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      disabled={saving}
                      onClick={updateProfile}
                      className="bg-[#5f6fff] hover:bg-[#4d5de6] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer disabled:bg-gray-400"
                    >
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#5f6fff] hover:bg-[#4d5de6] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>✏️</span> Chỉnh sửa thông tin
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
