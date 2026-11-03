import React, { useRef } from "react";
import { formatSlotDate, getSpecialityName } from "../utils/formatters";

const PrescriptionModal = ({ isOpen, appointment, onClose }) => {
  const printAreaRef = useRef(null);

  if (!isOpen || !appointment) return null;

  const { userData = {}, docData = {}, medicalRecord = {} } = appointment;
  const labTests = medicalRecord.labTests || [];
  const prescription = medicalRecord.prescription || [];
  const vitals = medicalRecord.vitals || {};

  const handlePrint = () => {
    window.print();
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} tuổi` : "Dưới 1 tuổi";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container */}
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:w-full print:rounded-none">
        {/* Header - Not printed in paper if customized */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-[#5f6fff] text-white p-4 sm:p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl shadow-inner">
              📄
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                Phiếu Khám Bệnh & Đơn Thuốc Điện Tử
              </h2>
              <p className="text-emerald-100 text-xs">
                Mã ca khám: #BD-{appointment._id.slice(-6).toUpperCase()} • Ngày:{" "}
                {formatSlotDate(appointment.slotDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>🖨️</span> In đơn thuốc
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-gray-800 print:overflow-visible print:p-6"
        >
          {/* Clinic Brand & Header */}
          <div className="border-b-2 border-gray-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#5f6fff] to-emerald-600">
                  BookingDoctor
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Hệ Thống Y Tế Chuẩn Hóa
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Phòng khám chuyên khoa • Hotline hỗ trợ: 1900 8198
              </p>
              {docData.address && (
                <p className="text-xs text-gray-400">
                  Địa chỉ: {docData.address.line1}
                  {docData.address.line2 ? `, ${docData.address.line2}` : ""}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono text-gray-400 block">
                MÃ HỒ SƠ BỆNH ÁN
              </span>
              <span className="text-base font-bold font-mono text-gray-900 block">
                #BD-{appointment._id.slice(-6).toUpperCase()}
              </span>
              <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                Ngày khám: {formatSlotDate(appointment.slotDate)} ({appointment.slotTime})
              </span>
            </div>
          </div>

          <div className="text-center py-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-gray-900 uppercase">
              PHIẾU KẾT QUẢ KHÁM BỆNH & ĐƠN THUỐC
            </h1>
            <p className="text-xs text-gray-500 italic">
              (Bác sĩ chẩn đoán dựa trên thăm khám lâm sàng và kết quả cận lâm sàng)
            </p>
          </div>

          {/* Patient & Doctor Two Columns Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-200 text-xs sm:text-sm">
            <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-4">
              <p className="font-bold text-gray-900 uppercase tracking-wide text-xs text-[#5f6fff]">
                Thông tin người bệnh:
              </p>
              <p>
                <span className="text-gray-500">Họ và tên:</span>{" "}
                <strong className="text-gray-900 text-base">{userData.name}</strong>
              </p>
              <p>
                <span className="text-gray-500">Độ tuổi:</span>{" "}
                <strong>{calculateAge(userData.dob)}</strong> • Giới tính:{" "}
                <strong>
                  {userData.gender === "Male"
                    ? "Nam"
                    : userData.gender === "Female"
                    ? "Nữ"
                    : "Khác"}
                </strong>
              </p>
              {userData.phone && (
                <p>
                  <span className="text-gray-500">Số điện thoại:</span>{" "}
                  <strong>{userData.phone}</strong>
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:pl-4">
              <p className="font-bold text-gray-900 uppercase tracking-wide text-xs text-[#5f6fff]">
                Bác sĩ điều trị:
              </p>
              <p>
                <span className="text-gray-500">Bác sĩ khám:</span>{" "}
                <strong className="text-gray-900 text-base">{docData.name}</strong>
              </p>
              <p>
                <span className="text-gray-500">Chuyên khoa:</span>{" "}
                <strong className="text-emerald-700">
                  {getSpecialityName(docData.speciality)}
                </strong>
              </p>
              <p>
                <span className="text-gray-500">Kinh nghiệm:</span>{" "}
                <span>{docData.experience || "Nhiều năm kinh nghiệm"}</span>
              </p>
            </div>
          </div>

          {/* Section 1: Clinical Symptoms & Vitals */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-[#5f6fff] pl-2.5">
              1. Khám Lâm Sàng & Chỉ Số Sinh Tồn
            </h3>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2 text-xs sm:text-sm">
              <p>
                <span className="font-semibold text-gray-700">Triệu chứng ban đầu:</span>{" "}
                <span className="text-gray-800">
                  {medicalRecord.symptoms || "Không ghi nhận bất thường đặc biệt."}
                </span>
              </p>

              {(vitals.bloodPressure || vitals.heartRate || vitals.temperature || vitals.weight) && (
                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {vitals.bloodPressure && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 block">Huyết áp:</span>
                      <strong className="text-gray-900">{vitals.bloodPressure} mmHg</strong>
                    </div>
                  )}
                  {vitals.heartRate && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 block">Nhịp tim:</span>
                      <strong className="text-gray-900">{vitals.heartRate} bpm</strong>
                    </div>
                  )}
                  {vitals.temperature && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 block">Thân nhiệt:</span>
                      <strong className="text-gray-900">{vitals.temperature} °C</strong>
                    </div>
                  )}
                  {vitals.weight && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 block">Cân nặng:</span>
                      <strong className="text-gray-900">{vitals.weight} kg</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Laboratory & Clinical Tests */}
          {labTests.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5">
                2. Chỉ Định Xét Nghiệm & Kết Quả Cận Lâm Sàng
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <th className="py-2.5 px-3 w-10 text-center font-bold">#</th>
                      <th className="py-2.5 px-3 font-bold">Tên xét nghiệm</th>
                      <th className="py-2.5 px-3 font-bold">Kết quả & Đánh giá cận lâm sàng</th>
                      <th className="py-2.5 px-3 w-28 text-center font-bold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {labTests.map((test, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-center text-gray-400 font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">
                          {test.testName}
                        </td>
                        <td className="py-2.5 px-3 text-gray-700">
                          {test.result || "Đạt chỉ số trong giới hạn sinh lý bình thường."}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              test.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {test.status === "Completed" ? "✔ Có kết quả" : "⏳ Chờ kết quả"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 3: Clinical Diagnosis */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-emerald-600 pl-2.5">
              3. Kết Luận Chẩn Đoán Của Bác Sĩ
            </h3>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs sm:text-sm">
              <span className="text-gray-500 font-medium block mb-1">
                Chẩn đoán xác định:
              </span>
              <p className="text-base sm:text-lg font-bold text-emerald-900 leading-snug">
                {medicalRecord.diagnosis || "Chưa ghi nhận chẩn đoán xác định."}
              </p>
            </div>
          </div>

          {/* Section 4: Prescription Medication Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-blue-600 pl-2.5">
              4. Đơn Thuốc Điều Trị
            </h3>
            {prescription.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500 text-center">
                Không có chỉ định dùng thuốc trong ca khám này.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <th className="py-2.5 px-3 w-10 text-center font-bold">STT</th>
                      <th className="py-2.5 px-3 font-bold">Tên thuốc & Hàm lượng</th>
                      <th className="py-2.5 px-3 font-bold">Số lượng</th>
                      <th className="py-2.5 px-3 font-bold">Hướng dẫn sử dụng chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {prescription.map((med, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3 text-center text-gray-400 font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900 text-sm">
                            {med.medicineName}
                          </p>
                          {med.dosage && (
                            <span className="text-[11px] text-gray-500">
                              Hàm lượng: {med.dosage}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-bold text-emerald-700 text-sm">
                            {med.quantity}
                          </span>{" "}
                          <span className="text-xs text-gray-600">{med.unit || "Viên"}</span>
                        </td>
                        <td className="py-3 px-3 text-xs sm:text-sm text-gray-800 font-medium">
                          {med.usage || "Dùng theo chỉ dẫn của bác sĩ hoặc dược sĩ."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 5: Doctor's Advice & Signature */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-amber-500 pl-2.5">
              5. Lời Dặn Của Bác Sĩ & Lịch Hẹn Tái Khám
            </h3>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs sm:text-sm space-y-2">
              <p>
                <span className="font-bold text-amber-900">Lời dặn:</span>{" "}
                <span className="text-gray-800">
                  {medicalRecord.advice ||
                    "Uống thuốc đầy đủ đúng giờ, nghỉ ngơi hợp lý, kiêng đồ kích thích và tái khám nếu có triệu chứng bất thường."}
                </span>
              </p>
              {medicalRecord.followUpDate && (
                <p className="pt-2 border-t border-amber-100">
                  <span className="font-bold text-amber-900">Lịch hẹn tái khám:</span>{" "}
                  <strong className="text-blue-700">{medicalRecord.followUpDate}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-end text-center text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Người bệnh / Thân nhân</p>
              <p className="text-[11px] text-gray-400 italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-16"></div>
              <p className="font-bold text-gray-800">{userData.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-gray-400">
                Ngày cấp: {formatSlotDate(appointment.slotDate)}
              </p>
              <p className="font-semibold text-gray-600">Bác sĩ điều trị</p>
              <p className="text-[11px] text-gray-400 italic">(Đã ký điện tử)</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-emerald-600 font-mono font-bold text-sm tracking-wider border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded">
                  ✔ ELECTRONIC SIGNED
                </span>
              </div>
              <p className="font-bold text-gray-900">{docData.name}</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between print:hidden">
          <p className="text-xs text-gray-500">
            Phiếu khám & Đơn thuốc được lưu trữ vĩnh viễn trên hệ thống BookingDoctor.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span> In đơn thuốc
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
