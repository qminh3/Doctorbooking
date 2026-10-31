import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  formatCurrency,
  formatSlotDate,
  getSpecialityName,
  VIETQR_CONFIG,
  generateVietQRUrl,
} from "../utils/formatters";

const VietQRModal = ({
  isOpen,
  appointment,
  onClose,
  onPaymentSuccess,
  backendURL,
  token,
}) => {
  const [copiedField, setCopiedField] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  if (!isOpen || !appointment) return null;

  const rawAmount = appointment.amount;
  const actualAmount =
    rawAmount < 1000 && rawAmount > 0 ? rawAmount * 1000 : rawAmount;
  const transferContent = `BK ${appointment._id.slice(-6).toUpperCase()}`;
  const qrUrl = generateVietQRUrl(appointment.amount, appointment._id);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.info(`Đã sao chép ${fieldName}`);
    setTimeout(() => setCopiedField(""), 2000);
  };

  // Hàm mô phỏng xác nhận thanh toán Demo
  const handleConfirmDemoPayment = async () => {
    try {
      setIsProcessing(true);

      // Mô phỏng độ trễ xác thực giao dịch qua ngân hàng (1.2 giây)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const transactionId = `VQR${Date.now().toString().slice(-6)}${appointment._id.slice(-4).toUpperCase()}`;

      const { data } = await axios.post(
        `${backendURL}/api/user/complete-payment`,
        {
          appointmentId: appointment._id,
          paymentMethod: "VietQR (Napas 24/7)",
          transactionId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Xác nhận thanh toán qua VietQR thành công!");
        onPaymentSuccess(transactionId);
        onClose();
      } else {
        toast.error(data.message || "Xác nhận thanh toán thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi xác nhận giao dịch");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
        >
          ✕
        </button>

        {/* Header Modal */}
        <div className="text-center pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-2">
            <span>⚡ Chuẩn VietQR</span>
            <span>•</span>
            <span>Napas 24/7</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Thanh Toán Viện Phí
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Mở ứng dụng ngân hàng bất kỳ để quét mã QR chuyển khoản nhanh 24/7
          </p>
        </div>

        {/* Thông tin ca khám tóm tắt */}
        <div className="mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Bác sĩ phụ trách:</span>
            <span className="font-bold text-gray-800">
              {appointment.docData.name} ({getSpecialityName(appointment.docData.speciality)})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Thời gian khám:</span>
            <span className="font-semibold text-gray-700">
              {formatSlotDate(appointment.slotDate)} lúc {appointment.slotTime}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-700">Tổng tiền viện phí:</span>
            <span className="text-xl font-extrabold text-[#5f6fff]">
              {formatCurrency(appointment.amount)}
            </span>
          </div>
        </div>

        {/* Vùng hiển thị Mã QR VietQR */}
        <div className="mt-5 flex flex-col items-center">
          <div className="relative p-3 bg-white rounded-2xl border-2 border-blue-100 shadow-md">
            {!qrLoaded && (
              <div className="w-56 h-72 flex flex-col items-center justify-center bg-gray-50 rounded-xl text-xs text-gray-400 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5f6fff]"></div>
                <span>Đang tạo mã VietQR...</span>
              </div>
            )}
            <img
              src={qrUrl}
              alt="Mã QR VietQR Napas 24/7"
              onLoad={() => setQrLoaded(true)}
              className={`w-64 sm:w-72 h-auto object-contain rounded-xl transition-opacity duration-300 ${
                qrLoaded ? "opacity-100" : "opacity-0 absolute"
              }`}
            />
          </div>

          <p className="text-[11px] text-gray-500 mt-2 text-center">
            Hỗ trợ tất cả ứng dụng ngân hàng: Vietcombank, MB Bank, Techcombank, BIDV, VPBank, ACB...
          </p>
        </div>

        {/* Thông tin chuyển khoản sao chép nhanh */}
        <div className="mt-4 bg-blue-50/60 rounded-2xl p-3.5 border border-blue-100 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Ngân hàng:</span>
            <span className="font-bold text-gray-900">{VIETQR_CONFIG.bankName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700 text-sm tracking-wider">
                {VIETQR_CONFIG.accountNo}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(VIETQR_CONFIG.accountNo, "Số tài khoản")}
                className="px-2 py-0.5 bg-white border border-blue-200 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer"
              >
                {copiedField === "Số tài khoản" ? "Đã chép ✓" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Chủ tài khoản:</span>
            <span className="font-bold text-gray-900">{VIETQR_CONFIG.accountName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Nội dung chuyển khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600 text-sm tracking-wider">
                {transferContent}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(transferContent, "Nội dung")}
                className="px-2 py-0.5 bg-white border border-blue-200 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer"
              >
                {copiedField === "Nội dung" ? "Đã chép ✓" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Khung hướng dẫn Test Demo */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
          <p className="font-bold flex items-center gap-1 mb-1">
            <span>💡</span> Chế độ thử nghiệm (Demo Test):
          </p>
          <p className="text-amber-800 leading-relaxed">
            Bạn có thể mở app ngân hàng quét mã QR trên để kiểm tra thông tin tự động điền, sau đó bấm nút{" "}
            <strong>"Xác nhận thanh toán (Demo)"</strong> bên dưới để hoàn tất ca khám ngay mà không cần chuyển khoản thật.
          </p>
        </div>

        {/* Các nút hành động */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmDemoPayment}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang đối soát giao dịch Napas 24/7...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Xác nhận đã thanh toán (Demo Test)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            Để thanh toán sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default VietQRModal;
