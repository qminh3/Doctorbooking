import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import MedicalRecordModal from "../../components/MedicalRecordModal";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, formatSlotDate, formatCurrency, getAppointmentStatusInfo } =
    useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancelModalId, setCancelModalId] = useState(null);
  const [selectedAppointmentForMedical, setSelectedAppointmentForMedical] =
    useState(null);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const handleConfirmCancel = () => {
    if (cancelModalId) {
      cancelAppointment(cancelModalId);
      setCancelModalId(null);
    }
  };

  const filteredAppointments = appointments.filter((item) => {
    const patientName = (item.userData?.name || "").toLowerCase();
    const matchesSearch = patientName.includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === "pending") {
      matchesStatus = !item.cancelled && !item.isCompleted && !item.payment;
    } else if (filterStatus === "paid") {
      matchesStatus = item.payment && !item.isCompleted && !item.cancelled;
    } else if (filterStatus === "completed") {
      matchesStatus = item.isCompleted;
    } else if (filterStatus === "cancelled") {
      matchesStatus = item.cancelled;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Lịch Khám Của Bác Sĩ
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Tiếp nhận bệnh nhân, ghi nhận kết quả xét nghiệm, chẩn đoán và kê đơn thuốc.
          </p>
        </div>
        <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-gray-500">Tổng ca khám:</span>
          <span className="text-sm font-bold text-[#5f6fff]">{appointments.length}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs mb-5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên bệnh nhân..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#5f6fff] focus:bg-white transition"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-[#5f6fff]"
        >
          <option value="all">Tất cả ca khám</option>
          <option value="pending">Chờ khám</option>
          <option value="paid">Đã thanh toán trước</option>
          <option value="completed">Đã hoàn tất</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Clean Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-12">#</th>
                <th className="py-3 px-4">Bệnh nhân</th>
                <th className="py-3 px-4">Tuổi</th>
                <th className="py-3 px-4">Thanh toán</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Viện phí</th>
                <th className="py-3 px-4">Trạng thái & Bệnh án</th>
                <th className="py-3 px-4 text-center min-w-[180px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400 text-xs">
                    Không có ca khám nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item, index) => {
                  const status = getAppointmentStatusInfo(item);
                  const hasMedicalRecord =
                    item.medicalRecord &&
                    (item.medicalRecord.diagnosis ||
                      (item.medicalRecord.prescription &&
                        item.medicalRecord.prescription.length > 0) ||
                      (item.medicalRecord.labTests &&
                        item.medicalRecord.labTests.length > 0));

                  return (
                    <tr key={item._id || index} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4 text-center text-xs text-gray-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-9 h-9 rounded-full object-cover bg-gray-100 border border-gray-200"
                            src={item.userData?.image || "https://placehold.co/100x100"}
                            alt={item.userData?.name}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                              {item.userData?.name || "Bệnh nhân ẩn danh"}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {item.userData?.phone || item.userData?.email || "Chưa có SĐT"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs">
                        {calculateAge(item.userData?.dob)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium ${
                            item.payment
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.payment ? (item.paymentMethod || "VietQR") : "Tiền mặt"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-medium text-gray-900 block">
                          {formatSlotDate(item.slotDate)}
                        </span>
                        <span className="text-gray-500">{item.slotTime}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900 text-xs">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {status.text}
                          </span>
                          {hasMedicalRecord && (
                            <span className="block text-[11px] text-[#5f6fff] font-medium">
                              Đã có bệnh án
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {!item.cancelled && !item.isCompleted ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedAppointmentForMedical(item)}
                              className="px-3 py-1.5 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-lg text-xs font-medium transition cursor-pointer"
                              title="Khám và kê đơn"
                            >
                              Khám bệnh
                            </button>
                            <button
                              onClick={() => completeAppointment(item._id)}
                              className="px-2.5 py-1.5 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-medium transition cursor-pointer"
                              title="Hoàn tất nhanh"
                            >
                              Khám xong
                            </button>
                            <button
                              onClick={() => setCancelModalId(item._id)}
                              className="px-2 py-1.5 text-gray-400 hover:text-rose-600 rounded-lg text-xs transition cursor-pointer"
                              title="Hủy lịch hẹn"
                            >
                              ✕
                            </button>
                          </div>
                        ) : item.isCompleted ? (
                          <button
                            onClick={() => setSelectedAppointmentForMedical(item)}
                            className="px-3 py-1.5 border border-gray-200 hover:border-[#5f6fff] text-gray-700 hover:text-[#5f6fff] rounded-lg text-xs font-medium transition cursor-pointer"
                          >
                            Hồ sơ bệnh án
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Đã hủy</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medical Examination Modal */}
      <MedicalRecordModal
        isOpen={Boolean(selectedAppointmentForMedical)}
        appointment={selectedAppointmentForMedical}
        onClose={() => setSelectedAppointmentForMedical(null)}
      />

      {/* Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 text-center space-y-4">
            <h3 className="text-base font-bold text-gray-900">Xác nhận hủy ca khám?</h3>
            <p className="text-gray-500 text-xs">
              Bác sĩ có chắc chắn muốn hủy lịch hẹn khám bệnh này?
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
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointment;
