import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Admincontext = createContext();
const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log("Fetched doctors:", data.doctors);
      } else {
        toast.error(data.message);
        console.error("Failed to fetch doctors:", data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
        console.error("Failed to change availability:", data.message);
      }
    } catch (error) {
      console.error("Error changing availability:", error);
    }
  };
  const value = {
    aToken,
    setAToken,
    doctors,
    setDoctors,
    backendUrl,
    getAllDoctors,
    changeAvailability,
  };

  return (
    <Admincontext.Provider value={value}>
      {props.children}
    </Admincontext.Provider>
  );
};
export default AdminContextProvider;
