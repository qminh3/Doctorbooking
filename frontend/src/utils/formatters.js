// Từ điển chuyên khoa tiếng Việt
export const specialityMap = {
  "General physician": "Bác sĩ Đa khoa",
  "Gynecologist": "Sản phụ khoa",
  "Dermatologist": "Da liễu",
  "Pediatricians": "Nhi khoa",
  "Neurologist": "Thần kinh",
  "Gastroenterologist": "Tiêu hóa",
};

export const getSpecialityName = (speciality) => {
  return specialityMap[speciality] || speciality || "Chuyên khoa";
};

// Định dạng tiền tệ theo chuẩn Việt Nam (VNĐ)
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount) || 0;
  }
  // Nếu dữ liệu mẫu lưu dạng 50 (usd) thì quy đổi hiển thị tương đương 50.000 đ, nếu lưu sẵn hàng nghìn thì giữ nguyên
  const displayAmount = amount < 1000 && amount > 0 ? amount * 1000 : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(displayAmount);
};

// Thứ trong tuần tiếng Việt
export const daysOfWeekShort = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
export const daysOfWeekFull = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

// Định dạng ngày slotDate dạng "D_M_YYYY" sang ngày tiếng Việt
export const formatSlotDate = (slotDate) => {
  if (!slotDate) return "";
  const parts = slotDate.split("_");
  if (parts.length < 3) return slotDate;
  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];
  return `${day}/${month}/${year}`;
};

// Lấy thông tin trạng thái lịch hẹn tiếng Việt
export const getAppointmentStatusInfo = (item) => {
  if (item.cancelled) {
    return {
      text: "Đã hủy",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    };
  }
  if (item.isCompleted) {
    return {
      text: "Đã khám xong",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    };
  }
  if (item.payment) {
    return {
      text: "Đã thanh toán",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    };
  }
  return {
    text: "Chờ khám",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  };
};
