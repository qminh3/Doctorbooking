import express from "express";

import {
  userRegister,
  userLogin,
  userProfile,
  userUpdateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentComplete,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);

userRouter.get("/get-profile", authUser, userProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  userUpdateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/list-appointments", authUser, listAppointments);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/complete-payment", authUser, paymentComplete);
export default userRouter;
