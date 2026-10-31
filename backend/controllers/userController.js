import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userrModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ tất cả các trường thông tin" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Địa chỉ email không hợp lệ" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải chứa ít nhất 8 ký tự" });
    }

    const existingUser = await userrModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email này đã được sử dụng để đăng ký tài khoản" });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userrModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
    }
    const user = await userrModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Tài khoản không tồn tại trong hệ thống" });
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        token,
      });
    } else {
      return res.status(400).json({ success: false, message: "Mật khẩu không chính xác" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

// Lấy thông tin user
const userProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userrModel.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông tin người dùng" });
    }
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Cập nhật thông tin profile user
const userUpdateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Vui lòng điền đầy đủ các thông tin bắt buộc" });
    }

    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        parsedAddress = { line1: address, line2: "" };
      }
    }

    await userrModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userrModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "Cập nhật hồ sơ thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Đặt lịch hẹn
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin bác sĩ",
      });
    }

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Bác sĩ hiện đang tạm ngưng nhận lịch khám",
      });
    }

    let slots_booked = docData.slots_booked || {};

    // Kiểm tra slot đã được book chưa
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Khung giờ này đã được đặt, vui lòng chọn giờ khác",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userrModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({
      success: true,
      message: "Đặt lịch khám bệnh thành công!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy lịch sử đặt lịch của user
const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    return res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Hủy lịch hẹn
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin lịch hẹn",
      });
    }

    if (appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "Bạn không có quyền hủy lịch hẹn này",
      });
    }

    if (appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Lịch hẹn này đã bị hủy trước đó",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
      let slots_booked = doctorData.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    return res.json({
      success: true,
      message: "Hủy lịch hẹn khám thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Cấu hình Razorpay (nếu cần mở rộng)
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret",
});

// Hoàn tất thanh toán
const paymentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin lịch hẹn",
      });
    }

    if (appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Không thể thanh toán cho lịch hẹn đã bị hủy",
      });
    }

    if (appointmentData.payment) {
      return res.json({
        success: false,
        message: "Lịch hẹn này đã hoàn tất thanh toán trước đó",
      });
    }

    // Cập nhật trạng thái payment
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
    });

    return res.json({
      success: true,
      message: "Thanh toán viện phí thành công!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export {
  userRegister,
  userLogin,
  userProfile,
  userUpdateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentComplete,
};
