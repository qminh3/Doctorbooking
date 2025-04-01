import React, { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    email: "edward.vincent@example.com",
    phone: "1234567890",
    address: {
      line1: "123 Main St",
      line2: "Apt 4B",
    },
    image: assets.profile_pic,
    gender: "Male",
    dob: "1990-01-01",
  });
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div>
      <img src={userData.image} alt="" />
      {isEdit ? (
        <input
          value={userData.name}
          type="text"
          onChange={(e) => {
            setUserData((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
      ) : (
        <p>{userData.name} </p>
      )}
      <hr />
      <div>
        <p>CONTACT INFORMATION</p>
        <div>
          <p>{userData.email} </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
