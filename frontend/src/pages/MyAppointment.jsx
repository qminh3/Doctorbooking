import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  formatSlotDate,
  formatCurrency,
  getSpecialityName,
  getAppointmentStatusInfo,
} from "../utils/formatters";

const MyAppointment = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelModalId, setCancelModalId] = useState(null);

  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendURL}/api/user/list-appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách lịch hẹn của bạn");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelModalId) return;
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId: cancelModalId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || "Đã hủy lịch hẹn khám thành công");
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message || "Không thể hủy lịch hẹn");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi hủy lịch hẹn");
    } finally {
      setCancelModalId(null);
    }
  };

  const initiatePayment = async (appointmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendURL}/api/user/complete-payment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Thanh toán viện phí thành công!");
        getUserAppointments();
      } else {
        toast.error(data.message || "Thanh toán thất bại");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Đã xảy ra lỗi trong quá trình thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  if (loading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f6fff]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lịch Hẹn Của Tôi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Theo dõi trạng thái ca khám, quản lý thời gian và hoàn tất viện phí tiện lợi.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📅
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Bạn chưa có lịch hẹn khám nào
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Hãy khám phá danh sách bác sĩ chuyên khoa và đặt lịch khám ngay hôm nay để chăm sóc sức khỏe tốt nhất.
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="px-6 py-2.5 bg-[#5f6fff] text-white rounded-full font-semibold text-sm hover:shadow-md transition"
          >
            Đặt lịch khám ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((item, index) => {
            const status = getAppointmentStatusInfo(item);

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xs border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0">
                    <img
                      className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover bg-blue-50 border border-gray-100"
                      src={item.docData.image}
                      alt={item.docData.name}
                    />
                  </div>

                  {/* Doctor & Appointment Info */}
                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {item.docData.name}
                        </h3>
                        <p className="text-[#5f6fff] font-semibold text-xs sm:text-sm">
                          {getSpecialityName(item.docData.speciality)}
                        </p>
                      </div>
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.textColor} border ${status.borderColor} w-fit`}
                      >
                        {status.text}
                      </span>
                    </div>

                    {/* Address */}
                    {item.docData.address && (
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-gray-400">📍</span>
                        <span>
                          {item.docData.address.line1}
                          {item.docData.address.line2 ? `, ${item.docData.address.line2}` : ""}
                        </span>
                      </div>
                    )}

                    {/* Time Slot */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-800 font-medium">
                      <span className="text-gray-400">⏰</span>
                      <span>
                        Thời gian: <strong>{formatSlotDate(item.slotDate)}</strong> lúc{" "}
                        <strong className="text-blue-600">{item.slotTime}</strong>
                      </span>
                    </div>

                    {/* Fee */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-gray-400">💵</span>
                      <span>
                        Viện phí:{" "}
                        <strong className="text-emerald-600 font-bold">
                          {formatCurrency(item.amount)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex-shrink-0 flex flex-col justify-center gap-2 sm:min-w-[180px]">
                    {!item.cancelled && !item.isCompleted && !item.payment && (
                      <>
                        <button
                          onClick={() => initiatePayment(item._id)}
                          className="w-full px-4 py-2.5 bg-[#5f6fff] hover:bg-[#4d5de6] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>💳</span> Thanh toán ngay
                        </button>
                        <button
                          onClick={() => setCancelModalId(item._id)}
                          className="w-full px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer"
                        >
                          Hủy lịch hẹn
                        </button>
                      </>
                    )}

                    {item.payment && !item.isCompleted && !item.cancelled && (
                      <div className="text-center py-2.5 px-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <span className="text-xs sm:text-sm text-blue-700 font-semibold">
                          ✔ Đã thanh toán viện phí
                        </span>
                      </div>
                    )}

                    {item.cancelled && (
                      <div className="text-center py-2.5 px-4 bg-red-50 border border-red-200 rounded-xl">
                        <span className="text-xs sm:text-sm text-red-600 font-medium">
                          Ca khám đã bị hủy
                        </span>
                      </div>
                    )}

                    {item.isCompleted && (
                      <div className="text-center py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-xs sm:text-sm text-emerald-700 font-semibold">
                          ✔ Đã hoàn tất buổi khám
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Cancellation */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-800">Xác nhận hủy lịch hẹn?</h3>
            <p className="text-gray-500 text-sm">
              Bạn có chắc chắn muốn hủy lịch hẹn này? Khung giờ khám sẽ được trả lại cho bệnh nhân khác đặt lịch.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium text-sm hover:bg-gray-50"
              >
                Giữ lại
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm shadow-xs"
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

export default MyAppointment;
