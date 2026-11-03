import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, default: "" }, // VietQR, Cash, VNPay, etc.
  paymentDate: { type: Number, default: 0 },
  transactionId: { type: String, default: "" },
  isCompleted: { type: Boolean, default: false },
  // Nghiệp vụ khám bệnh, cận lâm sàng & đơn thuốc
  medicalRecord: {
    symptoms: { type: String, default: "" }, // Triệu chứng lâm sàng
    vitals: {
      bloodPressure: { type: String, default: "" }, // Huyết áp (mmHg)
      heartRate: { type: String, default: "" },      // Nhịp tim (bpm)
      temperature: { type: String, default: "" },    // Thân nhiệt (°C)
      weight: { type: String, default: "" },         // Cân nặng (kg)
    },
    labTests: [
      {
        testName: { type: String, default: "" },     // Tên xét nghiệm (vd: Công thức máu, X-Quang...)
        result: { type: String, default: "" },       // Kết quả xét nghiệm
        status: { type: String, default: "Completed" }, // "Pending" | "Completed"
        testDate: { type: String, default: "" },     // Thời gian thực hiện
      },
    ],
    diagnosis: { type: String, default: "" },         // Chẩn đoán xác định của bác sĩ
    prescription: [
      {
        medicineName: { type: String, default: "" }, // Tên thuốc
        dosage: { type: String, default: "" },       // Liều lượng (vd: 500mg)
        quantity: { type: Number, default: 1 },      // Số lượng
        unit: { type: String, default: "Viên" },     // Đơn vị (Viên, Gói, Lọ, Ống...)
        usage: { type: String, default: "" },        // Hướng dẫn sử dụng
      },
    ],
    advice: { type: String, default: "" },           // Lời dặn bác sĩ
    followUpDate: { type: String, default: "" },     // Ngày hẹn tái khám
    updatedAt: { type: Date, default: Date.now },
  },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);
export default appointmentModel;
