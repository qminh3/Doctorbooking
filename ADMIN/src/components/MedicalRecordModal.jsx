import React, { useState, useEffect, useContext } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AppContext } from "../context/AppContext";

const QUICK_LAB_TESTS = [
  "Công thức máu toàn phần (CBC)",
  "Sinh hóa máu (Men gan, Đường huyết, Creatinine)",
  "Tổng phân tích nước tiểu 10 thông số",
  "Chụp X-quang tim phổi thẳng",
  "Siêu âm ổ bụng tổng quát",
  "Điện tâm đồ (ECG)",
  "Nội soi tai mũi họng",
  "Test nhanh Cúm A/B",
];

const QUICK_DIAGNOSES = [
  "Viêm đường hô hấp trên cấp tính",
  "Viêm họng cấp tính",
  "Viêm phế quản cấp",
  "Cảm cúm thông thường (Flu syndrome)",
  "Rối loạn tiêu hóa cấp",
  "Viêm dạ dày - tá tràng cấp",
  "Tăng huyết áp nguyên phát",
  "Suy nhược cơ thể / Mệt mỏi kéo dài",
];

const COMMON_MEDICINES = [
  {
    name: "Augmentin 1000mg",
    dosage: "1000mg",
    unit: "Viên",
    quantity: 14,
    usage: "Uống sáng 1 viên, tối 1 viên sau ăn no (7 ngày)",
  },
  {
    name: "Panadol Extra 500mg",
    dosage: "500mg",
    unit: "Viên",
    quantity: 10,
    usage: "Uống 1 viên khi sốt > 38.5°C hoặc đau đầu, cách nhau tối thiểu 4-6 giờ",
  },
  {
    name: "Decolgen Forte",
    dosage: "1 viên/lần",
    unit: "Viên",
    quantity: 10,
    usage: "Uống sáng 1 viên, chiều 1 viên sau ăn",
  },
  {
    name: "Alpha Choay",
    dosage: "2 viên/lần",
    unit: "Viên",
    quantity: 20,
    usage: "Ngậm dưới lưỡi 2 viên/lần, ngày 2 lần sau ăn",
  },
  {
    name: "Nexium 40mg",
    dosage: "40mg",
    unit: "Viên",
    quantity: 14,
    usage: "Uống 1 viên vào buổi sáng trước bữa ăn 30-60 phút",
  },
  {
    name: "Berberin 100mg",
    dosage: "100mg",
    unit: "Viên",
    quantity: 20,
    usage: "Uống 2 viên/lần x 2 lần/ngày sau khi ăn",
  },
  {
    name: "Vitamin C 500mg",
    dosage: "500mg",
    unit: "Viên",
    quantity: 10,
    usage: "Uống 1 viên buổi sáng sau ăn no để tăng sức đề kháng",
  },
];

const MedicalRecordModal = ({ isOpen, appointment, onClose }) => {
  const { saveMedicalRecord } = useContext(DoctorContext);
  const { calculateAge, formatSlotDate } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("clinical"); // clinical, tests, diagnosis, prescription, advice
  const [symptoms, setSymptoms] = useState("");
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
  });
  const [labTests, setLabTests] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState([]);
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Điền dữ liệu nếu đã có bệnh án trước đó
  useEffect(() => {
    if (appointment) {
      const mr = appointment.medicalRecord || {};
      setSymptoms(mr.symptoms || "");
      setVitals({
        bloodPressure: mr.vitals?.bloodPressure || "120/80",
        heartRate: mr.vitals?.heartRate || "75",
        temperature: mr.vitals?.temperature || "37.0",
        weight: mr.vitals?.weight || "",
      });
      setLabTests(
        mr.labTests && mr.labTests.length > 0
          ? mr.labTests
          : []
      );
      setDiagnosis(mr.diagnosis || "");
      setPrescription(
        mr.prescription && mr.prescription.length > 0
          ? mr.prescription
          : [
              {
                medicineName: "",
                dosage: "",
                quantity: 10,
                unit: "Viên",
                usage: "",
              },
            ]
      );
      setAdvice(mr.advice || "Nghỉ ngơi hợp lý, uống nhiều nước ấm, tuân thủ đơn thuốc đúng liều lượng.");
      setFollowUpDate(mr.followUpDate || "");
    }
  }, [appointment, isOpen]);

  if (!isOpen || !appointment) return null;

  // Xử lý thêm xét nghiệm
  const handleAddLabTest = (testName = "") => {
    setLabTests([
      ...labTests,
      {
        testName,
        result: "",
        status: "Completed",
        testDate: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const handleRemoveLabTest = (index) => {
    setLabTests(labTests.filter((_, i) => i !== index));
  };

  const handleUpdateLabTest = (index, field, value) => {
    const updated = [...labTests];
    updated[index][field] = value;
    setLabTests(updated);
  };

  // Xử lý thêm dòng thuốc
  const handleAddPrescriptionRow = (medicine = null) => {
    if (medicine) {
      setPrescription([
        ...prescription.filter((p) => p.medicineName.trim() !== ""),
        {
          medicineName: medicine.name,
          dosage: medicine.dosage,
          quantity: medicine.quantity,
          unit: medicine.unit,
          usage: medicine.usage,
        },
      ]);
    } else {
      setPrescription([
        ...prescription,
        {
          medicineName: "",
          dosage: "",
          quantity: 10,
          unit: "Viên",
          usage: "",
        },
      ]);
    }
  };

  const handleRemovePrescriptionRow = (index) => {
    setPrescription(prescription.filter((_, i) => i !== index));
  };

  const handleUpdatePrescriptionRow = (index, field, value) => {
    const updated = [...prescription];
    updated[index][field] = value;
    setPrescription(updated);
  };

  // Lưu bệnh án
  const handleSave = async (isCompleted = true) => {
    // Lọc bỏ các dòng thuốc trống
    const cleanedPrescription = prescription.filter(
      (item) => item.medicineName && item.medicineName.trim() !== ""
    );
    const cleanedLabTests = labTests.filter(
      (item) => item.testName && item.testName.trim() !== ""
    );

    const recordPayload = {
      symptoms,
      vitals,
      labTests: cleanedLabTests,
      diagnosis,
      prescription: cleanedPrescription,
      advice,
      followUpDate,
    };

    setLoading(true);
    const success = await saveMedicalRecord(appointment._id, recordPayload, isCompleted);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  const userData = appointment.userData || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#5f6fff] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-2xl shadow-inner">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Hồ Sơ Khám Bệnh & Đơn Thuốc</h2>
                <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  #BD-{appointment._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <p className="text-blue-100 text-xs mt-0.5">
                Bệnh nhân: <strong>{userData.name}</strong> •{" "}
                {calculateAge(userData.dob)} • Giới tính: {userData.gender === "Male" ? "Nam" : userData.gender === "Female" ? "Nữ" : "Khác"} • Ngày khám: {formatSlotDate(appointment.slotDate)} lúc {appointment.slotTime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-5 text-sm overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("clinical")}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "clinical"
                ? "border-[#5f6fff] text-[#5f6fff]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>1. Khám Lâm Sàng</span>
          </button>
          <button
            onClick={() => setActiveTab("tests")}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "tests"
                ? "border-[#5f6fff] text-[#5f6fff]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>2. Xét Nghiệm & Kết Quả</span>
            {labTests.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {labTests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("diagnosis")}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "diagnosis"
                ? "border-[#5f6fff] text-[#5f6fff]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>3. Chẩn Đoán Bệnh</span>
            {diagnosis && <span className="text-emerald-500 text-xs">✔</span>}
          </button>
          <button
            onClick={() => setActiveTab("prescription")}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "prescription"
                ? "border-[#5f6fff] text-[#5f6fff]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>4. Kê Đơn Thuốc</span>
            {prescription.filter((p) => p.medicineName.trim()).length > 0 && (
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {prescription.filter((p) => p.medicineName.trim()).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("advice")}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "advice"
                ? "border-[#5f6fff] text-[#5f6fff]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>5. Lời Dặn & Tái Khám</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: KHÁM LÂM SÀNG & SINH HIỆU */}
          {activeTab === "clinical" && (
            <div className="space-y-6">
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <span>🩺</span> Chỉ số sinh tồn (Sinh hiệu)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Huyết áp (mmHg)
                    </label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={vitals.bloodPressure}
                      onChange={(e) =>
                        setVitals({ ...vitals, bloodPressure: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nhịp tim (lần/phút)
                    </label>
                    <input
                      type="text"
                      placeholder="75"
                      value={vitals.heartRate}
                      onChange={(e) =>
                        setVitals({ ...vitals, heartRate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Thân nhiệt (°C)
                    </label>
                    <input
                      type="text"
                      placeholder="37.0"
                      value={vitals.temperature}
                      onChange={(e) =>
                        setVitals({ ...vitals, temperature: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Cân nặng (kg)
                    </label>
                    <input
                      type="text"
                      placeholder="60"
                      value={vitals.weight}
                      onChange={(e) =>
                        setVitals({ ...vitals, weight: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Lý do đến khám & Triệu chứng lâm sàng của bệnh nhân:
                </label>
                <textarea
                  rows="5"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Ghi nhận triệu chứng lâm sàng: sốt, ho, đau họng, đau tức ngực, mệt mỏi, tiền sử bệnh tật..."
                  className="w-full p-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5f6fff] outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  Tiếp theo: Chỉ định xét nghiệm ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: XÉT NGHIỆM CẬN LÂM SÀNG & KẾT QUẢ */}
          {activeTab === "tests" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Gợi ý chỉ định xét nghiệm nhanh:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_LAB_TESTS.map((test, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddLabTest(test)}
                      className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition font-medium cursor-pointer"
                    >
                      + {test}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    Danh sách các xét nghiệm đã chỉ định ({labTests.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddLabTest("")}
                    className="text-xs font-semibold text-[#5f6fff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    + Thêm xét nghiệm tùy chỉnh
                  </button>
                </div>

                {labTests.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
                    Chưa có xét nghiệm nào. Nhấp vào các gợi ý xét nghiệm phía trên hoặc nút "Thêm xét nghiệm".
                  </div>
                ) : (
                  <div className="space-y-3">
                    {labTests.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group"
                      >
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                          <div className="flex-1 w-full">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Tên xét nghiệm #{index + 1}
                            </label>
                            <input
                              type="text"
                              value={item.testName}
                              onChange={(e) =>
                                handleUpdateLabTest(index, "testName", e.target.value)
                              }
                              placeholder="Tên xét nghiệm (vd: Chụp X-quang phổi)"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#5f6fff] outline-none"
                            />
                          </div>

                          <div className="w-full sm:w-44">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Trạng thái
                            </label>
                            <select
                              value={item.status}
                              onChange={(e) =>
                                handleUpdateLabTest(index, "status", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 outline-none"
                            >
                              <option value="Completed">✔ Đã có kết quả</option>
                              <option value="Pending">⏳ Chờ kết quả</option>
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveLabTest(index)}
                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition cursor-pointer self-end sm:self-center"
                          >
                            Xóa
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Kết quả xét nghiệm & Nhận xét cận lâm sàng:
                          </label>
                          <textarea
                            rows="2"
                            value={item.result}
                            onChange={(e) =>
                              handleUpdateLabTest(index, "result", e.target.value)
                            }
                            placeholder="Nhập kết quả xét nghiệm (chỉ số, mô tả hình ảnh X-quang, siêu âm...)"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5f6fff] outline-none"
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("clinical")}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ⬅ Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("diagnosis")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  Tiếp theo: Chẩn đoán bệnh ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CHẨN ĐOÁN BỆNH */}
          {activeTab === "diagnosis" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Chọn nhanh bệnh lý chẩn đoán thường gặp:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_DIAGNOSES.map((diag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDiagnosis(diag)}
                      className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition font-medium cursor-pointer"
                    >
                      {diag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Kết luận chẩn đoán xác định của Bác sĩ:
                </label>
                <textarea
                  rows="4"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Nhập chẩn đoán bệnh dựa trên triệu chứng lâm sàng và kết quả cận lâm sàng..."
                  className="w-full p-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#5f6fff] outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-800">
                💡 <strong>Gợi ý:</strong> Kết luận chẩn đoán sẽ được hiển thị trang trọng trên Đơn thuốc điện tử và hồ sơ bệnh án của bệnh nhân.
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ⬅ Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("prescription")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  Tiếp theo: Kê đơn thuốc ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: KÊ ĐƠN THUỐC */}
          {activeTab === "prescription" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Thêm nhanh các loại thuốc thông dụng:
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_MEDICINES.map((med, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPrescriptionRow(med)}
                      className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition font-medium cursor-pointer"
                    >
                      + {med.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    Danh mục thuốc kê đơn ({prescription.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddPrescriptionRow()}
                    className="text-xs font-semibold text-[#5f6fff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    + Thêm dòng thuốc mới
                  </button>
                </div>

                <div className="space-y-3">
                  {prescription.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3"
                    >
                      <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-12 sm:col-span-4">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {index + 1}. Tên thuốc
                          </label>
                          <input
                            type="text"
                            value={item.medicineName}
                            onChange={(e) =>
                              handleUpdatePrescriptionRow(
                                index,
                                "medicineName",
                                e.target.value
                              )
                            }
                            placeholder="Tên thuốc (vd: Augmentin)"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#5f6fff] outline-none"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Hàm lượng / Liều
                          </label>
                          <input
                            type="text"
                            value={item.dosage}
                            onChange={(e) =>
                              handleUpdatePrescriptionRow(
                                index,
                                "dosage",
                                e.target.value
                              )
                            }
                            placeholder="500mg, 1g..."
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none"
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Số lượng
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdatePrescriptionRow(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center outline-none"
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Đơn vị
                          </label>
                          <select
                            value={item.unit}
                            onChange={(e) =>
                              handleUpdatePrescriptionRow(
                                index,
                                "unit",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs outline-none"
                          >
                            <option value="Viên">Viên</option>
                            <option value="Gói">Gói</option>
                            <option value="Hộp">Hộp</option>
                            <option value="Chai">Chai</option>
                            <option value="Lọ">Lọ</option>
                            <option value="Tuýp">Tuýp</option>
                            <option value="Ống">Ống</option>
                          </select>
                        </div>

                        <div className="col-span-12 sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemovePrescriptionRow(index)}
                            className="text-red-500 hover:text-red-700 text-xs p-2 rounded hover:bg-red-50 transition cursor-pointer"
                            title="Xóa dòng thuốc này"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Cách dùng & Hướng dẫn sử dụng:
                        </label>
                        <input
                          type="text"
                          value={item.usage}
                          onChange={(e) =>
                            handleUpdatePrescriptionRow(
                              index,
                              "usage",
                              e.target.value
                            )
                          }
                          placeholder="vd: Uống sáng 1 viên sau ăn, tối 1 viên sau ăn no"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("diagnosis")}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ⬅ Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("advice")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  Tiếp theo: Lời dặn & Hoàn tất ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LỜI DẶN BÁC SĨ & HẸN TÁI KHÁM */}
          {activeTab === "advice" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Lời dặn của Bác sĩ đối với bệnh nhân:
                </label>
                <textarea
                  rows="4"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Hướng dẫn chế độ ăn uống, sinh hoạt, tập luyện, các dấu hiệu cảnh báo cần tái khám ngay..."
                  className="w-full p-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5f6fff] outline-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Hẹn ngày tái khám (Nếu cần):
                </label>
                <input
                  type="text"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  placeholder="Ví dụ: Tái khám sau 5 ngày (09/11/2026) hoặc khi có dấu hiệu sốt cao lại"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5f6fff] outline-none"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div className="text-xs text-emerald-800">
                  <p className="font-bold">Sẵn sàng hoàn tất ca khám!</p>
                  <p className="mt-0.5 text-emerald-700">
                    Khi nhấn <strong>"Lưu Bệnh Án & Hoàn Tất Ca Khám"</strong>, ca khám sẽ được đánh dấu hoàn thành và bệnh nhân có thể tra cứu kết quả xét nghiệm, chẩn đoán và đơn thuốc trực tiếp từ ứng dụng.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("prescription")}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ⬅ Quay lại
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Hồ sơ được cập nhật bởi Bác sĩ điều trị.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-medium transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-[#5f6fff] text-[#5f6fff] hover:bg-blue-50 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>✔</span> Lưu Bệnh Án & Hoàn Tất
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordModal;
