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
  const [experience, setExperience] = useState("1 năm");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { backendUrl, aToken } = useContext(Admincontext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docImg) {
      return toast.warn("Vui lòng tải lên ảnh chân dung của bác sĩ");
    }
    if (!aToken) {
      return toast.error("Phiên đăng nhập quản trị viên đã hết hạn. Vui lòng đăng nhập lại!");
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("about", about);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: {
            aToken,
          },
        }
      );

      if (data?.success) {
        toast.success(data?.message || "Thêm bác sĩ thành công!");
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 năm");
        setFees("");
        setSpeciality("General physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      } else {
        toast.error(data?.message || "Không thể thêm bác sĩ");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Đã xảy ra lỗi kết nối. Vui lòng thử lại!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-4 w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Thêm Bác Sĩ Mới</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Điền đầy đủ thông tin chuyên môn để tạo hồ sơ bác sĩ trên hệ thống.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        {/* Upload ảnh */}
        <div className="md:col-span-2">
          <label
            htmlFor="doc-img"
            className="flex w-full cursor-pointer items-center gap-5 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-[#5f6fff] hover:bg-blue-50/40"
          >
            <img
              className="h-16 w-16 rounded-xl object-cover border border-gray-200"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="doctor avatar"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">
                Tải lên ảnh chân dung bác sĩ
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                Định dạng JPG, PNG (tối đa 5MB). Nhấp vào đây để chọn ảnh.
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
            <label className="text-xs font-bold text-gray-700">
              Họ và tên bác sĩ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: BSCKII. Trần Minh Tuấn"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Địa chỉ Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@bookingdoctor.vn"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Mật khẩu đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Kinh nghiệm làm việc
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
            >
              <option value="1 năm">1 năm kinh nghiệm</option>
              <option value="2 năm">2 năm kinh nghiệm</option>
              <option value="3 năm">3 năm kinh nghiệm</option>
              <option value="4 năm">4 năm kinh nghiệm</option>
              <option value="5 năm">5 năm kinh nghiệm</option>
              <option value="8 năm">8 năm kinh nghiệm</option>
              <option value="10+ năm">Trên 10 năm kinh nghiệm</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Mức phí khám niêm yết (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="Ví dụ: 300000"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            />
          </div>
        </div>

        {/* Cột phải */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Chuyên khoa <span className="text-red-500">*</span>
            </label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
            >
              <option value="General physician">Bác sĩ Đa khoa</option>
              <option value="Gynecologist">Sản phụ khoa</option>
              <option value="Dermatologist">Da liễu</option>
              <option value="Pediatricians">Nhi khoa</option>
              <option value="Neurologist">Thần kinh</option>
              <option value="Gastroenterologist">Tiêu hóa</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Học vị / Bằng cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Ví dụ: BSCKII, ThS.BS, Bác sĩ Đa khoa"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Địa chỉ phòng khám (Dòng 1: Số nhà, tên đường) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Số 123 Đường Cầu Giấy"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Địa chỉ phòng khám (Dòng 2: Phường, Quận, Thành phố)
            </label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
            />
          </div>
        </div>

        {/* About full width */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-gray-700">
            Giới thiệu tiểu sử & quá trình công tác
          </label>
          <textarea
            rows={4}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Mô tả quá trình đào tạo, kinh nghiệm công tác và thế mạnh chuyên môn của bác sĩ..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:bg-white"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#5f6fff] hover:bg-[#4d5de6] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xs transition cursor-pointer disabled:bg-gray-400"
        >
          {submitting ? "Đang xử lý..." : "Lưu & Thêm Bác Sĩ"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
