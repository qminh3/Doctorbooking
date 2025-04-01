import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 ">
        <p>
          CONTACT <span className="text-gray-800">US</span>
        </p>
      </div>
      <div className="my-10  md:flex-row gap-12 max-w-5xl mx-auto py-12 px-6 flex flex-col  items-center ">
        <img
          className=" w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6 md:w-2/4 text-sm text-gray-600">
          <h1 className="text-gray-800 text-2xl font-bold">Our OFFICE</h1>
          <div className=" text-gray-600">
            <p>54709 Willms Station </p>
            <p>Suite 350, Washington, USA</p>
          </div>
          <div className="font-semibold text-gray-600 mt-2">
            <p>
              Tel: <span className="text-blue-600"></span>{" "}
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:quangminh30@gmail.com"
                className="text-blue-600 underline"
              >
                quangminh30@gmail.com
              </a>
            </p>
          </div>
          <h1 className="text-gray-800 text-2xl font-bold">
            Careers at PRESCRIPTO
          </h1>
          <p>Learn more about our teams and job openings.</p>

          <button className="inline-block border border-gray-800 text-gray-800 px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 hover:text-white transition">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
