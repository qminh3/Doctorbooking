import React, { useContext, useEffect, useState } from "react";
import { Admincontext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllApointments = () => {
  const { appointments, aToken, getAllAppointments, cancelAppointment } =
    useContext(Admincontext);
  const { calculateAge, formatSlotDate, formatCurrency, getSpecialityName, getAppointmentStatusInfo } =
    useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancelModalId, setCancelModalId] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const handleConfirmCancel = () => {
    if (cancelModalId) {
      cancelAppointment(cancelModalId);
      setCancelModalId(null);
    }
  };

  // Lọc lịch hẹn
  const filteredAppointments = appointments.filter((item) => {
    const patientName = (item.userData?.name || "").toLowerCase();
    const doctorName = (item.docData?.name || "").toLowerCase();
    const matchesSearch =
      patientName.includes(searchTerm.toLowerCase()) ||
      doctorName.includes(searchTerm.toLowerCase());

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
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Quản Lý Tất Cả Lịch Hẹn
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi, tra cứu và xử lý toàn bộ các lượt đặt lịch khám của bệnh nhân.
          </p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Tổng ca khám:</span>
          <span className="text-base font-bold text-blue-600">{appointments.length}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên bệnh nhân hoặc tên bác sĩ..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white transition"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5"
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
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
        >
          <option value="all">🌟 Tất cả trạng thái</option>
          <option value="pending">⏳ Chờ khám</option>
          <option value="paid">💳 Đã thanh toán</option>
          <option value="completed">✔ Đã khám xong</option>
          <option value="cancelled">❌ Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-4 text-center w-12">#</th>
                <th className="py-4 px-4">Bệnh nhân</th>
                <th className="py-4 px-4">Tuổi</th>
                <th className="py-4 px-4">Thời gian khám</th>
                <th className="py-4 px-4">Bác sĩ phụ trách</th>
                <th className="py-4 px-4">Viện phí</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    Không tìm thấy lịch hẹn nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item, index) => {
                  const status = getAppointmentStatusInfo(item);
                  return (
                    <tr key={item._id || index} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-4 text-center text-xs text-gray-400 font-bold">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200"
                            src={item.userData?.image || "https://placehold.co/100x100"}
                            alt={item.userData?.name}
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {item.userData?.name || "Bệnh nhân ẩn danh"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.userData?.phone || item.userData?.email || "Chưa có liên hệ"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 font-medium text-xs">
                        {calculateAge(item.userData?.dob)}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-gray-700">
                        <span className="block font-bold text-gray-900">
                          {formatSlotDate(item.slotDate)}
                        </span>
                        <span className="text-blue-600">{item.slotTime}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            className="w-8 h-8 rounded-lg object-cover bg-blue-50 border border-gray-200"
                            src={item.docData?.image}
                            alt=""
                          />
                          <div>
                            <p className="font-bold text-gray-800 text-xs">
                              {item.docData?.name}
                            </p>
                            <p className="text-[11px] text-[#5f6fff] font-medium">
                              {getSpecialityName(item.docData?.speciality)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-600 text-xs">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {!item.cancelled && !item.isCompleted ? (
                          <button
                            onClick={() => setCancelModalId(item._id)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition cursor-pointer"
                          >
                            Hủy
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">--</span>
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

      {/* Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-800">Xác nhận hủy lịch hẹn?</h3>
            <p className="text-gray-500 text-sm">
              Bạn có chắc chắn muốn hủy lịch hẹn này? Thao tác này sẽ cập nhật trạng thái ca khám thành Đã Hủy.
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

export default AllApointments;
