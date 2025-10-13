import doctorModel from "../models/doctorModel.js";

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
export { changeAvailability, doctorList };
