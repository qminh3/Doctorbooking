import validator from "validator";
import bycrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userrModel from "../models/userModel.js";

// Thêm bác sĩ mới
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Vui lòng tải lên ảnh đại diện của bác sĩ" });
    }

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !fees ||
      !address
    ) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ các thông tin bắt buộc" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Định dạng email không hợp lệ" });
    }

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: "Email này đã được đăng ký cho một bác sĩ khác" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu của bác sĩ phải có ít nhất 6 ký tự" });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        parsedAddress = { line1: address, line2: "" };
      }
    }

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about: about || "",
      available: available !== undefined ? available : true,
      fees: Number(fees),
      address: parsedAddress,
      date: Date.now(),
      image: imageUrl,
      slots_booked: {},
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({
      success: true,
      message: "Thêm bác sĩ mới vào hệ thống thành công!",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Lỗi thêm bác sĩ:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

// Đăng nhập Admin
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập email và mật khẩu quản trị viên" });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({
        success: true,
        message: "Đăng nhập tài khoản Quản trị viên thành công",
        token,
      });
    }

    res
      .status(401)
      .json({ success: false, message: "Email hoặc mật khẩu Quản trị viên không chính xác" });
  } catch (error) {
    console.error("Lỗi đăng nhập quản trị viên:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy toàn bộ danh sách bác sĩ
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Lỗi lấy danh sách bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy toàn bộ danh sách lịch hẹn của hệ thống
const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Lỗi lấy danh sách lịch hẹn:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Quản trị viên hủy lịch hẹn
const admincancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch hẹn" });
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
      message: "Quản trị viên đã hủy lịch hẹn thành công",
    });
  } catch (error) {
    console.error("Lỗi hủy lịch hẹn phía admin:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Bảng điều khiển tổng quan cho Admin
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userrModel.find({});
    const appointments = await appointmentModel.find({});

    const dashBoardData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      lastestAppointments: appointments.slice(-5).reverse(),
    };
    return res.json({ success: true, dashBoardData });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu bảng điều khiển:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

export {
  addDoctor,
  adminLogin,
  allDoctors,
  appointmentAdmin,
  admincancelAppointment,
  adminDashboard,
};
