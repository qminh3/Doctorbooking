import express from "express";
import {
  changeAvailability,
  doctorList,
} from "../controllers/doctorController.js";
import authAdmin from "../middlewares/authAdmin.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);

export default doctorRouter;
