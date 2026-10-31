import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "VNĐ";
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/list`);

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || "Không thể tải danh sách bác sĩ");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối đến máy chủ để tải danh sách bác sĩ");
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Không thể tải thông tin hồ sơ");
      }
    } catch (error) {
      console.error(error);
      // Nếu lỗi 401 hoặc 403, xóa token cũ
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setToken(false);
        localStorage.removeItem("token");
      }
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    userData,
    setUserData,
    backendURL,
    loadUserProfile,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
