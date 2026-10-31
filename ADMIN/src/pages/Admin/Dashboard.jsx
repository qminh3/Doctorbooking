import React, { useContext, useEffect, useState } from "react";
import { Admincontext } from "../../context/AdminContext";
import doctor_icon from "../../assets/assets_admin/doctor_icon.svg";
import appointment_icon from "../../assets/assets_admin/appointments_icon.svg";
import user_icon from "../../assets/assets_admin/patients_icon.svg";
import list_icon from "../../assets/assets_admin/list_icon.svg";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { aToken, dashboardData, getDashboard, cancelAppointment } =
    useContext(Admincontext);
  const { formatSlotDate, getSpecialityName, getAppointmentStatusInfo } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [cancelModalId, setCancelModalId] = useState(null);

  useEffect(() => {
    if (aToken) {
      getDashboard();
    }
  }, [aToken]);

  const handleConfirmCancel = () => {
    if (cancelModalId) {
      cancelAppointment(cancelModalId);
      setCancelModalId(null);
    }
  };

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Tổng quan số liệu vận hành và hoạt động khám chữa bệnh của phòng khám hôm nay.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Bác sĩ */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-blue-900">
              {dashboardData.doctors}
            </p>
            <p className="text-blue-700 font-semibold text-sm mt-1">
              Bác sĩ trong hệ thống
            </p>
            <p className="text-blue-500 text-xs mt-0.5">Đội ngũ y tế đang hoạt động</p>
          </div>
          <div className="w-14 h-14 bg-blue-200/80 rounded-2xl flex items-center justify-center p-3">
            <img className="w-full h-full object-contain" src={doctor_icon} alt="Bác sĩ" />
          </div>
        </div>

        {/* Lịch hẹn */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-emerald-900">
              {dashboardData.appointments}
            </p>
            <p className="text-emerald-700 font-semibold text-sm mt-1">
              Tổng số lượt đặt lịch
            </p>
            <p className="text-emerald-500 text-xs mt-0.5">Tất cả các ca khám ghi nhận</p>
          </div>
          <div className="w-14 h-14 bg-emerald-200/80 rounded-2xl flex items-center justify-center p-3">
            <img className="w-full h-full object-contain" src={appointment_icon} alt="Lịch hẹn" />
          </div>
        </div>

        {/* Bệnh nhân */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-purple-900">
              {dashboardData.patients}
            </p>
            <p className="text-purple-700 font-semibold text-sm mt-1">
              Bệnh nhân đã đăng ký
            </p>
            <p className="text-purple-500 text-xs mt-0.5">Hồ sơ người dùng hoạt động</p>
          </div>
          <div className="w-14 h-14 bg-purple-200/80 rounded-2xl flex items-center justify-center p-3">
            <img className="w-full h-full object-contain" src={user_icon} alt="Bệnh nhân" />
          </div>
        </div>
      </div>

      {/* Lịch hẹn gần đây */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="w-4 h-4 opacity-70" src={list_icon} alt="" />
            <h2 className="text-base font-bold text-gray-800">
              Lịch Hẹn Mới Nhất
            </h2>
          </div>
          <button
            onClick={() => navigate("/all-appointment")}
            className="text-xs text-[#5f6fff] font-bold hover:underline cursor-pointer"
          >
            Xem tất cả &rarr;
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {!dashboardData.lastestAppointments ||
          dashboardData.lastestAppointments.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-3xl block mb-2">📋</span>
              <h3 className="text-base font-semibold text-gray-700">
                Chưa có lịch hẹn nào gần đây
              </h3>
            </div>
          ) : (
            dashboardData.lastestAppointments.map((item, index) => {
              const status = getAppointmentStatusInfo(item);
              return (
                <div
                  key={item._id || index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-gray-50 transition gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-xl object-cover bg-blue-50 border border-gray-200"
                      src={item.docData?.image}
                      alt={item.docData?.name}
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {item.docData?.name}
                      </p>
                      <p className="text-xs text-[#5f6fff] font-medium">
                        {getSpecialityName(item.docData?.speciality)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Bệnh nhân: <strong>{item.userData?.name || "Khách"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right text-xs">
                      <p className="font-semibold text-gray-800">
                        {formatSlotDate(item.slotDate)}
                      </p>
                      <p className="text-gray-500 font-medium">{item.slotTime}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                      >
                        {status.text}
                      </span>

                      {!item.cancelled && !item.isCompleted && (
                        <button
                          onClick={() => setCancelModalId(item._id)}
                          className="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition cursor-pointer"
                          title="Hủy lịch hẹn"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-800">Xác nhận hủy lịch hẹn?</h3>
            <p className="text-gray-500 text-sm">
              Bạn có chắc chắn muốn hủy ca khám này với quyền Quản trị viên?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium text-sm hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm shadow-xs"
              >
                Hủy lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
