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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5f6fff]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Tổng quan số liệu vận hành và hoạt động khám chữa bệnh của phòng khám.
        </p>
      </div>

      {/* 3 Clean Metric Cards - Unified Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {/* Bác sĩ */}
        <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-gray-300 transition">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Bác sĩ trong hệ thống
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {dashboardData.doctors}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Đội ngũ y tế đang hoạt động</p>
          </div>
          <div className="w-11 h-11 bg-[#f0f3ff] rounded-xl flex items-center justify-center p-2.5">
            <img className="w-full h-full object-contain opacity-80" src={doctor_icon} alt="Bác sĩ" />
          </div>
        </div>

        {/* Lịch hẹn */}
        <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-gray-300 transition">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số lượt đặt lịch
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {dashboardData.appointments}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Tất cả các ca khám ghi nhận</p>
          </div>
          <div className="w-11 h-11 bg-[#f0f3ff] rounded-xl flex items-center justify-center p-2.5">
            <img className="w-full h-full object-contain opacity-80" src={appointment_icon} alt="Lịch hẹn" />
          </div>
        </div>

        {/* Bệnh nhân */}
        <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-gray-300 transition">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Bệnh nhân đăng ký
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {dashboardData.patients}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Hồ sơ người dùng hoạt động</p>
          </div>
          <div className="w-11 h-11 bg-[#f0f3ff] rounded-xl flex items-center justify-center p-2.5">
            <img className="w-full h-full object-contain opacity-80" src={user_icon} alt="Bệnh nhân" />
          </div>
        </div>
      </div>

      {/* Lịch hẹn gần đây */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/70 px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="w-4 h-4 opacity-70" src={list_icon} alt="" />
            <h2 className="text-sm font-bold text-gray-800">
              Lịch Hẹn Mới Nhất
            </h2>
          </div>
          <button
            onClick={() => navigate("/all-appointment")}
            className="text-xs text-[#5f6fff] font-semibold hover:underline cursor-pointer"
          >
            Xem tất cả &rarr;
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {!dashboardData.lastestAppointments ||
          dashboardData.lastestAppointments.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              Chưa có lịch hẹn nào gần đây
            </div>
          ) : (
            dashboardData.lastestAppointments.map((item, index) => {
              const status = getAppointmentStatusInfo(item);
              return (
                <div
                  key={item._id || index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50/50 transition gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-xl object-cover bg-gray-100 border border-gray-200"
                      src={item.docData?.image}
                      alt={item.docData?.name}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {item.docData?.name}
                      </p>
                      <p className="text-xs text-[#5f6fff] font-medium">
                        {getSpecialityName(item.docData?.speciality)}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Bệnh nhân: <strong>{item.userData?.name || "Khách"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-left sm:text-right text-xs">
                      <p className="font-medium text-gray-800">
                        {formatSlotDate(item.slotDate)}
                      </p>
                      <p className="text-gray-400">{item.slotTime}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {status.text}
                      </span>

                      {!item.cancelled && !item.isCompleted && (
                        <button
                          onClick={() => setCancelModalId(item._id)}
                          className="px-2 py-1 text-gray-400 hover:text-rose-600 rounded-lg text-xs transition cursor-pointer"
                          title="Hủy lịch hẹn"
                        >
                          ✕
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
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 text-center space-y-4">
            <h3 className="text-base font-bold text-gray-900">Xác nhận hủy lịch hẹn?</h3>
            <p className="text-gray-500 text-xs">
              Bạn có chắc chắn muốn hủy ca khám này với quyền Quản trị viên?
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 font-medium text-xs hover:bg-gray-50 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-xs cursor-pointer transition"
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
