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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container */}
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:w-full print:rounded-none">
        {/* Clean Header - No gradients */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] text-[#5f6fff] flex items-center justify-center text-lg font-bold">
              📄
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Phiếu Khám Bệnh & Đơn Thuốc Điện Tử
              </h2>
              <p className="text-gray-500 text-xs">
                Mã ca khám: #BD-{appointment._id.slice(-6).toUpperCase()} • Ngày:{" "}
                {formatSlotDate(appointment.slotDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              In đơn thuốc
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center text-lg transition cursor-pointer"
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
          <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#5f6fff] tracking-tight">
                  BookingDoctor
                </span>
                <span className="bg-[#f0f3ff] text-[#5f6fff] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#d6e0ff] uppercase tracking-wider">
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
                MÃ HỒ SƠ
              </span>
              <span className="text-base font-bold font-mono text-gray-900 block">
                #BD-{appointment._id.slice(-6).toUpperCase()}
              </span>
              <span className="text-xs text-gray-500 block mt-0.5">
                Ngày khám: {formatSlotDate(appointment.slotDate)} ({appointment.slotTime})
              </span>
            </div>
          </div>

          <div className="text-center py-1">
            <h1 className="text-lg sm:text-xl font-bold tracking-wide text-gray-900 uppercase">
              PHIẾU KẾT QUẢ KHÁM BỆNH & ĐƠN THUỐC
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              (Bác sĩ chẩn đoán dựa trên thăm khám lâm sàng và kết quả cận lâm sàng)
            </p>
          </div>

          {/* Patient & Doctor Two Columns Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-200 text-xs sm:text-sm">
            <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-4">
              <p className="font-semibold text-gray-500 uppercase tracking-wide text-xs">
                Thông tin người bệnh:
              </p>
              <p>
                <span className="text-gray-500">Họ và tên:</span>{" "}
                <strong className="text-gray-900 text-sm sm:text-base">{userData.name}</strong>
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
              <p className="font-semibold text-gray-500 uppercase tracking-wide text-xs">
                Bác sĩ phụ trách:
              </p>
              <p>
                <span className="text-gray-500">Bác sĩ khám:</span>{" "}
                <strong className="text-gray-900 text-sm sm:text-base">{docData.name}</strong>
              </p>
              <p>
                <span className="text-gray-500">Chuyên khoa:</span>{" "}
                <strong className="text-[#5f6fff]">
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
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-3 border-[#5f6fff] pl-2.5">
              1. Khám Lâm Sàng & Sinh Hiệu
            </h3>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2 text-xs sm:text-sm">
              <p>
                <span className="font-medium text-gray-600">Triệu chứng ban đầu:</span>{" "}
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
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-3 border-[#5f6fff] pl-2.5">
                2. Chỉ Định & Kết Quả Xét Nghiệm
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600">
                      <th className="py-2.5 px-3 w-10 text-center font-bold">#</th>
                      <th className="py-2.5 px-3 font-bold">Tên xét nghiệm</th>
                      <th className="py-2.5 px-3 font-bold">Kết quả cận lâm sàng</th>
                      <th className="py-2.5 px-3 w-28 text-center font-bold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {labTests.map((test, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-center text-gray-400 font-medium">
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
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                              test.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
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
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-3 border-[#5f6fff] pl-2.5">
              3. Kết Luận Chẩn Đoán Của Bác Sĩ
            </h3>
            <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200 text-xs sm:text-sm">
              <span className="text-gray-500 font-medium block mb-1">
                Chẩn đoán xác định:
              </span>
              <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                {medicalRecord.diagnosis || "Chưa ghi nhận chẩn đoán xác định."}
              </p>
            </div>
          </div>

          {/* Section 4: Prescription Medication Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-3 border-[#5f6fff] pl-2.5">
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
                    <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600">
                      <th className="py-2.5 px-3 w-10 text-center font-bold">STT</th>
                      <th className="py-2.5 px-3 font-bold">Tên thuốc & Hàm lượng</th>
                      <th className="py-2.5 px-3 font-bold">Số lượng</th>
                      <th className="py-2.5 px-3 font-bold">Hướng dẫn sử dụng chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {prescription.map((med, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-center text-gray-400 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {med.medicineName}
                          </p>
                          {med.dosage && (
                            <span className="text-[11px] text-gray-500">
                              Hàm lượng: {med.dosage}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-xs font-semibold text-gray-800">
                          {med.quantity} {med.unit || "Viên"}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-700 font-medium">
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
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-l-3 border-[#5f6fff] pl-2.5">
              5. Lời Dặn Của Bác Sĩ & Hẹn Tái Khám
            </h3>
            <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200 text-xs space-y-1.5">
              <p>
                <span className="font-semibold text-gray-700">Lời dặn:</span>{" "}
                <span className="text-gray-800">
                  {medicalRecord.advice ||
                    "Uống thuốc đầy đủ đúng giờ, nghỉ ngơi hợp lý và tái khám nếu có triệu chứng bất thường."}
                </span>
              </p>
              {medicalRecord.followUpDate && (
                <p className="pt-1.5 border-t border-gray-200">
                  <span className="font-semibold text-gray-700">Lịch hẹn tái khám:</span>{" "}
                  <strong className="text-[#5f6fff]">{medicalRecord.followUpDate}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-end text-center text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Người bệnh / Thân nhân</p>
              <p className="text-[11px] text-gray-400 italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-14"></div>
              <p className="font-bold text-gray-800">{userData.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-gray-400">
                Ngày cấp: {formatSlotDate(appointment.slotDate)}
              </p>
              <p className="font-semibold text-gray-600">Bác sĩ điều trị</p>
              <p className="text-[11px] text-gray-400 italic">(Đã ký điện tử)</p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-[#5f6fff] font-mono font-bold text-xs tracking-wider border border-[#d6e0ff] bg-[#f0f3ff] px-2 py-0.5 rounded">
                  ✔ ELECTRONIC SIGNED
                </span>
              </div>
              <p className="font-bold text-gray-900">{docData.name}</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between print:hidden">
          <p className="text-xs text-gray-400">
            Hồ sơ đơn thuốc điện tử BookingDoctor.
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              In đơn thuốc
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-medium transition cursor-pointer"
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
