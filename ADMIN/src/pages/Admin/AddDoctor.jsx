import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { Admincontext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Sửa chính tả: backendUrl
  const { backendUrl, aToken } = useContext(Admincontext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docImg) {
      return toast.error("Please upload a doctor image");
    }
    if (!aToken) {
      return toast.error("Missing admin token. Please log in again.");
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("speciality", speciality);
      formData.append("education", education.trim());
      formData.append("about", about.trim());
      formData.append(
        "address1",
        JSON.stringify({ line1: address1.trim(), line2: address2.trim() })
      );

      // ✅ Sửa header đúng chuẩn Authorization
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            aToken,
          },
        }
      );

      if (data?.success) {
        toast.success("Doctor added successfully");
        // reset nhanh
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 year");
        setFees("");
        setSpeciality("General physician");
        setEducation("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      } else {
        toast.error(data?.message || "Failed to add doctor");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Unexpected error. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-6 w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
        <p className="text-lg font-semibold text-gray-800">Add Doctor</p>
        {/* <button
          type="submit"
          disabled={submitting}
          className="rounded-full px-6 py-2.5 text-white shadow-sm transition
                     bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Add doctor"}
        </button> */}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
        {/* Upload ảnh */}
        <div className="md:col-span-2">
          <label
            htmlFor="doc-img"
            className="flex w-full cursor-pointer items-center gap-5 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/50"
          >
            <img
              className="h-16 w-16 rounded-xl object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="doctor"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Upload doctor picture
              </span>
              <span className="text-xs text-gray-500">
                PNG/JPG up to 5MB. Click to select.
              </span>
            </div>
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files?.[0] || null)}
            type="file"
            id="doc-img"
            accept="image/*"
            hidden
          />
        </div>

        {/* Cột trái */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Doctor name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Doctor email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Doctor password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
              <option value="4 years">4 years</option>
              <option value="5 years">5 years</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Fees</label>
            <input
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              type="number"
              min={0}
              placeholder="Consultation fee"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>
        </div>

        {/* Cột phải */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Specialization
            </label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Education
            </label>
            <input
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              type="text"
              placeholder="E.g. MBBS, MD"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              type="text"
              placeholder="Address line 1"
              className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
            <input
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              type="text"
              placeholder="Address line 2"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                         placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            About Doctor
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={5}
            placeholder="Short bio, experiences, certifications..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                       placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            required
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 bg-gray-50/60 px-6 py-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full px-6 py-2.5 text-white shadow-sm transition
                     bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Add doctor"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
