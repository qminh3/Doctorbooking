import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  // TODO: Implement appointment component here
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableslots = async () => {
    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // get day index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // set hour
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        // add slot
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        // increment time
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableslots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);
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
        {/* booking slot */}
        <div className=" sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 ">
          <p>Booking slots</p>
          <div className=" flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-[#5f6fff] text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime(item[0].time);
                  }}
                >
                  <p>
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}{" "}
                    {console.log(item[0])}
                  </p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className=" flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-[#5f6fff] text-white"
                      : "border border-gray-200 text-gray-600"
                  } `}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button className=" text-sm  bg-[#5f6fff] text-white py-3 px-14 rounded-full my-6">
            Book Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
