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

// Định dạng tiền tệ VNĐ
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount) || 0;
  }
  const displayAmount = amount < 1000 && amount > 0 ? amount * 1000 : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(displayAmount);
};

// Định dạng ngày "D_M_YYYY" sang ngày "DD/MM/YYYY"
export const formatSlotDate = (slotDate) => {
  if (!slotDate) return "";
  const parts = slotDate.split("_");
  if (parts.length < 3) return slotDate;
  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];
  return `${day}/${month}/${year}`;
};

// Tính tuổi từ ngày sinh
export const calculateAge = (dob) => {
  if (!dob) return "--";
  const today = new Date();
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return "--";
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? `${age} tuổi` : "Dưới 1 tuổi";
};

// Thông tin trạng thái ca khám
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

// Cấu hình VietQR Demo
export const VIETQR_CONFIG = {
  bankId: "MB",
  bankName: "Ngân hàng Quân Đội (MB Bank)",
  accountNo: "0333666888",
  accountName: "PHONG KHAM BOOKINGDOCTOR",
  template: "compact2",
};
