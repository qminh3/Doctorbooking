import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Bật / tắt trạng thái sẵn sàng nhận lịch khám
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông tin bác sĩ" });
    }
    const newStatus = !docData.available;
    await doctorModel.findByIdAndUpdate(docId, {
      available: newStatus,
    });
    res.json({
      success: true,
      message: `Đã ${newStatus ? "bật" : "tắt"} trạng thái nhận lịch khám của bác sĩ`,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy danh sách bác sĩ công khai
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Lỗi lấy danh sách bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Đăng nhập Bác sĩ
const doctorlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
    }
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ success: false, message: "Email bác sĩ không tồn tại trong hệ thống" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ success: true, message: "Đăng nhập Bác sĩ thành công", token });
    } else {
      res.status(400).json({ success: false, message: "Mật khẩu không chính xác" });
    }
  } catch (error) {
    console.error("Lỗi đăng nhập bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy danh sách lịch hẹn của Bác sĩ
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Lỗi lấy lịch hẹn của bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Đánh dấu ca khám đã hoàn thành
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({
        success: true,
        message: "Đã xác nhận hoàn thành ca khám bệnh",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Lịch hẹn không hợp lệ hoặc bạn không có quyền xử lý",
      });
    }
  } catch (error) {
    console.error("Lỗi hoàn thành lịch hẹn:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Hủy lịch hẹn từ phía Bác sĩ
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      // Trả lại slot khám trống
      const { slotDate, slotTime } = appointmentData;
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
        message: "Đã hủy ca khám bệnh",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Lịch hẹn không hợp lệ hoặc bạn không có quyền xử lý",
      });
    }
  } catch (error) {
    console.error("Lỗi hủy lịch hẹn:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Bảng thống kê cá nhân của Bác sĩ
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    let totalEarnings = 0;

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        totalEarnings += item.amount;
      }
    });

    let patientsSet = new Set();
    appointments.forEach((item) => {
      if (item.userId) {
        patientsSet.add(item.userId.toString());
      }
    });

    const dashData = {
      totalEarnings,
      appointments: appointments.length,
      patients: patientsSet.size,
      latestAppointments: appointments.slice(-5).reverse(),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu bảng thống kê bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy hồ sơ cá nhân của Bác sĩ
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctorProfile = await doctorModel.findById(docId).select("-password");
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bác sĩ" });
    }
    res.json({ success: true, doctorData: doctorProfile });
  } catch (error) {
    console.error("Lỗi lấy hồ sơ bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

// Cập nhật thông tin hồ sơ của Bác sĩ
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
    });
    res.json({ success: true, message: "Cập nhật hồ sơ bác sĩ thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật hồ sơ bác sĩ:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

export {
  changeAvailability,
  doctorList,
  doctorlogin,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  updateDoctorProfile,
  doctorProfile,
};
