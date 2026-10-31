import { createContext } from "react";
import {
  calculateAge,
  formatSlotDate,
  formatCurrency,
  getSpecialityName,
  getAppointmentStatusInfo,
} from "../utils/formatters";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const currency = "VNĐ";

  // Giữ alias tương thích ngược nếu có file cũ gọi
  const caculateAge = calculateAge;
  const slotDateFormatter = formatSlotDate;

  const value = {
    caculateAge,
    calculateAge,
    slotDateFormatter,
    formatSlotDate,
    currency,
    formatCurrency,
    getSpecialityName,
    getAppointmentStatusInfo,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
