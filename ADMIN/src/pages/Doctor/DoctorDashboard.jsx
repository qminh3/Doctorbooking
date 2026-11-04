import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } =
    useContext(DoctorContext);
  const { formatCurrency, formatSlotDate, getAppointmentStatusInfo } =
    useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Bảng Làm Việc Bác Sĩ
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Tổng quan thu nhập và danh sách các ca khám gần nhất của bạn.
          </p>
        </div>

        {/* 3 Clean Metric Cards - Unified Clean White */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
          <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs flex items-center justify-between hover:border-gray-300 transition">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tổng thu nhập
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {formatCurrency(dashData.totalEarnings)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Ca hoàn tất & đã thanh toán</p>
            </div>
            <div className="w-11 h-11 bg-[#f0f3ff] text-[#5f6fff] rounded-xl flex items-center justify-center text-lg font-bold">
              ₫
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs flex items-center justify-between hover:border-gray-300 transition">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Lượt đặt khám
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {dashData.appointments}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Tổng lịch hẹn được ghi nhận</p>
            </div>
            <div className="w-11 h-11 bg-[#f0f3ff] text-[#5f6fff] rounded-xl flex items-center justify-center text-base">
              📅
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs flex items-center justify-between hover:border-gray-300 transition">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Số bệnh nhân
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {dashData.patients}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Bệnh nhân từng khám với bạn</p>
            </div>
            <div className="w-11 h-11 bg-[#f0f3ff] text-[#5f6fff] rounded-xl flex items-center justify-center text-base">
              👤
            </div>
          </div>
        </div>

        {/* Lịch hẹn gần nhất */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="bg-gray-50/70 px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">
              Ca Khám Gần Đây Nhất
            </h2>
            <button
              onClick={() => navigate("/doctor-appointment")}
              className="text-xs font-semibold text-[#5f6fff] hover:underline cursor-pointer"
            >
              Xem tất cả &rarr;
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => {
                const status = getAppointmentStatusInfo(item);
                return (
                  <div
                    key={index}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200"
                        src={item.userData?.image || "https://placehold.co/100x100"}
                        alt={item.userData?.name}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.userData?.name || "Bệnh nhân"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatSlotDate(item.slotDate)} lúc {item.slotTime} •{" "}
                          <span className="font-semibold text-gray-700">
                            {formatCurrency(item.amount)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {status.text}
                      </span>

                      {!item.cancelled && !item.isCompleted && (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="text-xs px-2.5 py-1 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-lg transition font-medium cursor-pointer"
                          >
                            Khám xong
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="text-xs px-2 py-1 text-gray-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center text-gray-400 text-xs">
                Chưa có ca khám nào gần đây
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
