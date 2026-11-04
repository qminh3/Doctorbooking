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
        mr.labTests && mr.labTests.length > 0 ? mr.labTests : []
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
      setAdvice(
        mr.advice ||
          "Nghỉ ngơi hợp lý, uống nhiều nước ấm, tuân thủ đơn thuốc đúng liều lượng."
      );
      setFollowUpDate(mr.followUpDate || "");
    }
  }, [appointment, isOpen]);

  if (!isOpen || !appointment) return null;

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

  const handleSave = async (isCompleted = true) => {
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
    const success = await saveMedicalRecord(
      appointment._id,
      recordPayload,
      isCompleted
    );
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  const userData = appointment.userData || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Clean Modern Header - No loud gradients */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] text-[#5f6fff] flex items-center justify-center font-bold text-base">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Hồ Sơ Khám Bệnh & Đơn Thuốc
                </h2>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono font-medium">
                  #BD-{appointment._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Bệnh nhân: <strong className="text-gray-800">{userData.name}</strong> •{" "}
                {calculateAge(userData.dob)} • {formatSlotDate(appointment.slotDate)} ({appointment.slotTime})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center text-lg transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Clean Underline Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-6 text-sm overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("clinical")}
            className={`py-3 px-3 font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "clinical"
                ? "border-[#5f6fff] text-[#5f6fff] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            1. Khám Lâm Sàng
          </button>
          <button
            onClick={() => setActiveTab("tests")}
            className={`py-3 px-3 font-medium border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "tests"
                ? "border-[#5f6fff] text-[#5f6fff] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>2. Xét Nghiệm</span>
            {labTests.length > 0 && (
              <span className="bg-[#f0f3ff] text-[#5f6fff] text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {labTests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("diagnosis")}
            className={`py-3 px-3 font-medium border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "diagnosis"
                ? "border-[#5f6fff] text-[#5f6fff] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>3. Chẩn Đoán</span>
            {diagnosis && <span className="text-[#5f6fff] text-xs">✔</span>}
          </button>
          <button
            onClick={() => setActiveTab("prescription")}
            className={`py-3 px-3 font-medium border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "prescription"
                ? "border-[#5f6fff] text-[#5f6fff] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>4. Kê Đơn Thuốc</span>
            {prescription.filter((p) => p.medicineName.trim()).length > 0 && (
              <span className="bg-[#f0f3ff] text-[#5f6fff] text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {prescription.filter((p) => p.medicineName.trim()).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("advice")}
            className={`py-3 px-3 font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "advice"
                ? "border-[#5f6fff] text-[#5f6fff] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            5. Lời Dặn & Tái Khám
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: KHÁM LÂM SÀNG & SINH HIỆU */}
          {activeTab === "clinical" && (
            <div className="space-y-5">
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Chỉ số sinh tồn (Sinh hiệu)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Huyết áp (mmHg)
                    </label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={vitals.bloodPressure}
                      onChange={(e) =>
                        setVitals({ ...vitals, bloodPressure: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Nhịp tim (lần/phút)
                    </label>
                    <input
                      type="text"
                      placeholder="75"
                      value={vitals.heartRate}
                      onChange={(e) =>
                        setVitals({ ...vitals, heartRate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Thân nhiệt (°C)
                    </label>
                    <input
                      type="text"
                      placeholder="37.0"
                      value={vitals.temperature}
                      onChange={(e) =>
                        setVitals({ ...vitals, temperature: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Cân nặng (kg)
                    </label>
                    <input
                      type="text"
                      placeholder="60"
                      value={vitals.weight}
                      onChange={(e) =>
                        setVitals({ ...vitals, weight: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Lý do đến khám & Triệu chứng ban đầu:
                </label>
                <textarea
                  rows="4"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Ghi nhận triệu chứng lâm sàng: sốt, ho, đau họng, đau tức ngực, mệt mỏi..."
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Chỉ định xét nghiệm &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: XÉT NGHIỆM CẬN LÂM SÀNG & KẾT QUẢ */}
          {activeTab === "tests" && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Chỉ định xét nghiệm nhanh:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_LAB_TESTS.map((test, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddLabTest(test)}
                      className="text-xs bg-gray-50 hover:bg-[#f0f3ff] hover:text-[#5f6fff] hover:border-[#d6e0ff] text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition font-medium cursor-pointer"
                    >
                      + {test}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    Danh sách xét nghiệm ({labTests.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddLabTest("")}
                    className="text-xs font-semibold text-[#5f6fff] hover:underline cursor-pointer"
                  >
                    + Thêm xét nghiệm khác
                  </button>
                </div>

                {labTests.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs">
                    Chưa có xét nghiệm nào được chọn. Nhấp vào các gợi ý phía trên nếu cần xét nghiệm cận lâm sàng.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {labTests.map((item, index) => (
                      <div
                        key={index}
                        className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200 space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between">
                          <div className="flex-1 w-full">
                            <input
                              type="text"
                              value={item.testName}
                              onChange={(e) =>
                                handleUpdateLabTest(index, "testName", e.target.value)
                              }
                              placeholder="Tên xét nghiệm"
                              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
                            />
                          </div>

                          <div className="w-full sm:w-40">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                handleUpdateLabTest(index, "status", e.target.value)
                              }
                              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none"
                            >
                              <option value="Completed">✔ Đã có kết quả</option>
                              <option value="Pending">⏳ Chờ kết quả</option>
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveLabTest(index)}
                            className="text-gray-400 hover:text-rose-600 text-xs px-2 py-1 rounded transition cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>

                        <div>
                          <textarea
                            rows="2"
                            value={item.result}
                            onChange={(e) =>
                              handleUpdateLabTest(index, "result", e.target.value)
                            }
                            placeholder="Nhập kết quả xét nghiệm / mô tả cận lâm sàng..."
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
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
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  &larr; Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("diagnosis")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Chẩn đoán bệnh &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CHẨN ĐOÁN BỆNH */}
          {activeTab === "diagnosis" && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Bệnh lý chẩn đoán thường gặp:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_DIAGNOSES.map((diag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDiagnosis(diag)}
                      className="text-xs bg-gray-50 hover:bg-[#f0f3ff] hover:text-[#5f6fff] hover:border-[#d6e0ff] text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition font-medium cursor-pointer"
                    >
                      {diag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Kết luận chẩn đoán của Bác sĩ:
                </label>
                <textarea
                  rows="3"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Ghi nhận chẩn đoán xác định dựa trên khám lâm sàng và kết quả xét nghiệm..."
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  &larr; Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("prescription")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Kê đơn thuốc &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: KÊ ĐƠN THUỐC */}
          {activeTab === "prescription" && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Thuốc gợi ý nhanh:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_MEDICINES.map((med, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPrescriptionRow(med)}
                      className="text-xs bg-gray-50 hover:bg-[#f0f3ff] hover:text-[#5f6fff] hover:border-[#d6e0ff] text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition font-medium cursor-pointer"
                    >
                      + {med.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-gray-800">
                    Danh mục thuốc kê đơn ({prescription.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddPrescriptionRow()}
                    className="text-xs font-semibold text-[#5f6fff] hover:underline cursor-pointer"
                  >
                    + Thêm dòng thuốc
                  </button>
                </div>

                <div className="space-y-2.5">
                  {prescription.map((item, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200 space-y-2"
                    >
                      <div className="grid grid-cols-12 gap-2.5 items-end">
                        <div className="col-span-12 sm:col-span-4">
                          <label className="block text-[11px] text-gray-500 mb-1">
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
                            placeholder="Tên thuốc"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
                          />
                        </div>

                        <div className="col-span-5 sm:col-span-3">
                          <label className="block text-[11px] text-gray-500 mb-1">
                            Liều lượng
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
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-[11px] text-gray-500 mb-1">
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
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-center outline-none"
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-[11px] text-gray-500 mb-1">
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
                            className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
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

                        <div className="col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemovePrescriptionRow(index)}
                            className="text-gray-400 hover:text-rose-600 text-xs p-1.5 transition cursor-pointer"
                            title="Xóa dòng thuốc"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div>
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
                          placeholder="Cách dùng: vd: Uống sáng 1 viên sau ăn, tối 1 viên sau ăn no"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
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
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  &larr; Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("advice")}
                  className="px-5 py-2.5 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Lời dặn & Hoàn tất &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LỜI DẶN BÁC SĨ & HẸN TÁI KHÁM */}
          {activeTab === "advice" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Lời dặn của Bác sĩ:
                </label>
                <textarea
                  rows="3"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Hướng dẫn chế độ ăn uống, nghỉ ngơi, các dấu hiệu cần tái khám ngay..."
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Hẹn ngày tái khám (Nếu có):
                </label>
                <input
                  type="text"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  placeholder="Ví dụ: Tái khám sau 5 ngày (09/11/2026)"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#5f6fff] focus:ring-1 focus:ring-[#5f6fff] outline-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("prescription")}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  &larr; Quay lại
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Solid consistent buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-400">
            Hồ sơ lưu trực tiếp vào cơ sở dữ liệu phòng khám.
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 border border-[#5f6fff] text-[#5f6fff] hover:bg-[#f0f3ff] rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2 bg-[#5f6fff] hover:bg-[#4d5de6] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Lưu Bệnh Án & Hoàn Tất"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordModal;
