import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getSpecialityName,
  formatCurrency,
  daysOfWeekShort,
  daysOfWeekFull,
} from "../utils/formatters";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendURL, token, getDoctorsData } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const doc = doctors.find((d) => d._id === docId);
    setDocInfo(doc || null);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);
    let today = new Date();
    let allDaysSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const slotDateKey = `${day}_${month}_${year}`;

      const bookedSlotsForDay =
        (docInfo.slots_booked && docInfo.slots_booked[slotDateKey]) || [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const isSlotAvailable = !bookedSlotsForDay.includes(formattedTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allDaysSlots.push(timeSlots);
    }

    setDocSlots(allDaysSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Vui lòng đăng nhập để tiến hành đặt lịch khám!");
      return navigate("/login");
    }

    if (!slotTime) {
      return toast.warn("Vui lòng chọn một khung giờ khám còn trống!");
    }

    try {
      setBookingLoading(true);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + slotIndex);
      const day = targetDate.getDate();
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Đặt lịch khám thành công!");
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message || "Không thể đặt lịch khám");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi trong quá trình đặt lịch. Vui lòng thử lại!");
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f6fff]"></div>
      </div>
    );
  }

  // Lấy ngày đã chọn để hiển thị chi tiết
  const selectedDateObj = new Date();
  selectedDateObj.setDate(selectedDateObj.getDate() + slotIndex);
  const selectedDayName = daysOfWeekFull[selectedDateObj.getDay()];
  const selectedDateStr = `${selectedDateObj.getDate().toString().padStart(2, "0")}/${(
    selectedDateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${selectedDateObj.getFullYear()}`;

  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* Doctor Info Card */}
      <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="sm:w-72 flex-shrink-0">
          <img
            className="w-full h-72 sm:h-80 object-cover bg-blue-50 rounded-2xl shadow-xs"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {docInfo.name}
              </h1>
              <img className="w-5 h-5" src={assets.verified_icon} alt="Chứng nhận" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm mt-2 text-gray-600">
              <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {getSpecialityName(docInfo.speciality)}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                Học vị: {docInfo.degree}
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-medium px-3 py-1 rounded-full">
                {docInfo.experience} kinh nghiệm
              </span>
            </div>

            <div className="mt-5">
              <p className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                <span>🩺</span> Giới thiệu & Quá trình công tác
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-1.5">
                {docInfo.about || "Bác sĩ tận tâm, nhiều năm kinh nghiệm khám và điều trị bệnh nhân."}
              </p>
            </div>

            {docInfo.address && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Phòng khám: </span>
                {docInfo.address.line1}
                {docInfo.address.line2 ? `, ${docInfo.address.line2}` : ""}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Giá khám niêm yết:</span>
              <span className="text-2xl font-bold text-[#5f6fff]">
                {formatCurrency(docInfo.fees)}
              </span>
            </div>
            <div className="text-right text-xs">
              <span
                className={`inline-block px-3 py-1 rounded-full font-medium ${
                  docInfo.available
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {docInfo.available ? "Đang nhận lịch khám" : "Tạm ngưng nhận lịch"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Slot Section */}
      <div className="mt-10 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>📅</span> Chọn Lịch Khám Bệnh
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Chọn ngày khám và khung giờ còn trống trong 7 ngày tới.
          </p>
        </div>

        {/* 1. Chọn ngày */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            1. Chọn ngày khám:
          </label>
          <div className="flex gap-3 items-center overflow-x-auto pb-2">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => {
                const dayDate = new Date();
                dayDate.setDate(dayDate.getDate() + index);
                const isSelected = slotIndex === index;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSlotIndex(index);
                      setSlotTime(""); // Reset giờ khi đổi ngày
                    }}
                    className={`text-center py-3.5 px-4 min-w-[76px] rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#5f6fff] text-white shadow-md scale-105 font-bold"
                        : "border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <p className="text-xs uppercase">{daysOfWeekShort[dayDate.getDay()]}</p>
                    <p className="text-lg font-bold mt-0.5">{dayDate.getDate()}</p>
                    <p className="text-[10px] opacity-75">Th{dayDate.getMonth() + 1}</p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 2. Chọn khung giờ */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              2. Chọn giờ khám cho ngày{" "}
              <span className="text-[#5f6fff] font-bold">
                {selectedDayName}, {selectedDateStr}
              </span>
              :
            </label>
          </div>

          {docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
            <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto p-1">
              {docSlots[slotIndex].map((item, index) => {
                const isSelected = item.time === slotTime;
                return (
                  <button
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#5f6fff] text-white shadow-sm scale-105"
                        : "border border-gray-200 text-gray-700 hover:border-[#5f6fff] hover:bg-blue-50"
                    }`}
                  >
                    ⏰ {item.time}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ Không còn ca khám trống trong ngày này. Vui lòng chọn một ngày khám khác!
              </p>
            </div>
          )}
        </div>

        {/* Booking Summary & Action */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            {slotTime ? (
              <p>
                Khung giờ đã chọn:{" "}
                <strong className="text-gray-900">
                  {slotTime} - {selectedDayName}, {selectedDateStr}
                </strong>
              </p>
            ) : (
              <p className="text-gray-400 italic">Vui lòng chọn khung giờ để tiếp tục</p>
            )}
          </div>

          <button
            onClick={bookAppointment}
            disabled={!docInfo.available || bookingLoading}
            className={`w-full sm:w-auto px-10 py-3.5 rounded-full text-white font-semibold text-sm shadow-md transition-all ${
              !docInfo.available || bookingLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5f6fff] hover:bg-[#4d5de6] hover:shadow-lg cursor-pointer"
            }`}
          >
            {bookingLoading ? "Đang xử lý..." : "Xác nhận đặt lịch khám"}
          </button>
        </div>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
