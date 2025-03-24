import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";

const Appointment = () => {
  // TODO: Implement appointment component here
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };
  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctors]);

  return (
    docInfo && (
      <div>
        <div className=" flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className=" bg-[#5f6fff]  w-full sm:max-w-72 rounded-lg "
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className=" flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className=" flex items-center gap-2 text-2xl font-semibold text-center ">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />{" "}
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <p className="py-0.5 px-2 border rounded-full bg-[#5f6fff] text-white">
                {docInfo.experience}{" "}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 font-medium mt-3">
                About <img src={assets.info_icon} alt="" />{" "}
              </p>
              <p className=" text-gray-600 max-w-[700px] mt-2">
                {docInfo.about}
              </p>
            </div>
            <p className=" text-l text-gray-700 font-medium mt-2">
              Appointment fee:{" "}
              <span className=" text-red-600">
                {currencySymbol} {docInfo.fees}{" "}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default Appointment;
