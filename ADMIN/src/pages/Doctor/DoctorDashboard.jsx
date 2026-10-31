import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const {
    dToken,
    getDashData,
    dashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { formatCurrency, formatSlotDate, getAppointmentStatusInfo } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [cancelModalId, setCancelModalId] = useState(null);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  const handleConfirmCancel = () => {
    if (cancelModalId) {
      cancelAppointment(cancelModalId);
      setCancelModalId(null);
    }
  };

  return (
    dashData && (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bảng Làm Việc Bác Sĩ
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Chào mừng trở lại! Theo dõi tổng thu nhập và các ca khám bệnh nhân hôm nay.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-2xl border border-emerald-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Tổng thu nhập
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-950">
                {formatCurrency(dashData.totalEarnings)}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Từ các ca khám hoàn tất & đã thanh toán</p>
            </div>
            <div className="w-12 h-12 bg-emerald-200/80 rounded-2xl flex items-center justify-center text-xl">
              💰
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-2xl border border-blue-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                Số lượt đặt hẹn
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-950">
                {dashData.appointments}
              </p>
              <p className="text-xs text-blue-600 mt-1">Tổng lịch hẹn khám được ghi nhận</p>
            </div>
            <div className="w-12 h-12 bg-blue-200/80 rounded-2xl flex items-center justify-center text-xl">
              📅
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 rounded-2xl border border-purple-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                Số bệnh nhân
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-950">
                {dashData.patients}
              </p>
              <p className="text-xs text-purple-600 mt-1">Bệnh nhân từng đặt khám với bạn</p>
            </div>
            <div className="w-12 h-12 bg-purple-200/80 rounded-2xl flex items-center justify-center text-xl">
              👥
            </div>
          </div>
        </div>

        {/* Lịch hẹn gần nhất */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">
              Ca Khám Gần Đây Nhất
            </h2>
            <button
              onClick={() => navigate("/doctor-appointment")}
              className="text-xs font-bold text-[#5f6fff] hover:underline cursor-pointer"
            >
              Xem tất cả ca khám &rarr;
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {!dashData.latestAppointments ||
            dashData.latestAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Chưa có ca khám nào gần đây
              </div>
            ) : (
              dashData.latestAppointments.map((item, index) => {
                const status = getAppointmentStatusInfo(item);
                return (
                  <div
                    key={item._id || index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-gray-50 transition gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200"
                        src={item.userData?.image || "https://placehold.co/100x100"}
                        alt={item.userData?.name}
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {item.userData?.name || "Bệnh nhân"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Thanh toán:{" "}
                          <strong className={item.payment ? "text-blue-600" : "text-amber-600"}>
                            {item.payment ? "Đã thanh toán" : "Thu tiền mặt"}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-left sm:text-right text-xs">
                        <p className="font-bold text-gray-800">
                          {formatSlotDate(item.slotDate)}
                        </p>
                        <p className="text-blue-600 font-medium">{item.slotTime}</p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                      >
                        {status.text}
                      </span>

                      {!item.cancelled && !item.isCompleted && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer"
                          >
                            ✔ Hoàn tất
                          </button>
                          <button
                            onClick={() => setCancelModalId(item._id)}
                            className="text-red-600 hover:bg-red-50 border border-red-200 text-xs font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Hủy lịch */}
        {cancelModalId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-gray-800">Xác nhận hủy ca khám?</h3>
              <p className="text-gray-500 text-sm">
                Bác sĩ có chắc chắn muốn hủy ca khám này không? Khung giờ sẽ được giải phóng trên hệ thống.
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
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default DoctorDashboard;
