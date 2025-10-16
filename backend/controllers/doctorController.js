import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    console.log("Received docId:", docId);
    const docData = await doctorModel.findById(docId);
    console.log("Current availability:", docData.available);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Doctor availability updated" });
  } catch (error) {
    console.error("Error changing doctor availability:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    console.log("Fetched doctors:", doctors);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DOCTOER CONTRLLER LOGIN

const doctorlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, message: "Login successful", token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// MARK APPOINTMENT AS COMPLETED
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId == docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({
        success: true,
        message: "Appointment  completed",
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid appointment or doctor ID",
      });
    }
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// cancel appointment for doctor
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId == docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      return res.json({
        success: true,
        message: "Appointment  cancelled",
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid appointment or doctor ID",
      });
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// doctor dashboard controller
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    let totalEarnings = 0;

    appointments.map((item, index) => {
      if (item.isCompleted || item.payment) {
        totalEarnings += item.amount;
      }
    });

    let patient = [];
    appointments.map((item) => {
      if (!patient.includes(item.userId)) {
        patient.push(item.userId);
      }
    });
    const dashData = {
      totalEarnings,
      appointments: appointments.length,
      patients: patient.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Error fetching doctor's dashboard data:", error);
  }
};

// dcotor profile
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctorProfile = await doctorModel.findById(docId).select("-password");
    if (!doctorProfile) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, doctorData: doctorProfile });
  } catch (error) {
    console.error("Error fetching doctor's profile data:", error);
  }
};
// doctor tu apdate profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
    });
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating doctor's profile data:", error);
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
