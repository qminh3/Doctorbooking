import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div className="min-h-screen  py-8">
      <div className="text-center text-3xl md:text-4xl font-bold pt-10 text-blue-700 tracking-wide relative inline-block w-full">
        <span className="after:content-[''] after:block after:w-16 after:h-1 after:bg-blue-400 after:mx-auto after:mt-2">
          ABOUT <span className="text-purple-700">US</span>
        </span>
      </div>
      <div className="my-12 flex flex-col md:flex-row gap-12 items-center justify-center px-4 md:px-0">
        <img
          src={assets.about_image}
          alt="About Prescripto"
          className="w-full md:max-w-[360px] rounded-3xl shadow-xl border-4 border-white"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-base text-gray-700 bg-white/80 rounded-2xl shadow-lg p-8 border border-blue-100">
          <p className="text-lg font-medium text-gray-800">
            Welcome to{" "}
            <span className="text-blue-600 font-bold">Prescripto</span>, your
            trusted partner in managing your healthcare needs conveniently and
            efficiently. At Prescripto, we understand the challenges individuals
            face when it comes to scheduling doctor appointments and managing
            their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <div>
            <b className="text-xl text-purple-700 block mb-2">Our Vision</b>
            <p>
              Our vision at{" "}
              <span className="text-blue-600 font-semibold">Prescripto</span> is
              to create a seamless healthcare experience for every user. We aim
              to bridge the gap between patients and healthcare providers,
              making it easier for you to access the care you need, when you
              need it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
