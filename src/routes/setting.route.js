import express from "express";
import settingService from "../controllers/setting.service.js";

const router = express.Router();

router.get("/", settingService.getSettingsPage);

router.get("/courseLecture", settingService.getCoursePage);

router.get("/courseStudent", settingService.getCourseStudentPage);

router.post("/courseStudent/remove", settingService.removeCourseStudentPage);

router.get("/favourite", settingService.getFavourite);

router.post("/favourite/remove", settingService.removeFavorite);

router.get("/profile", settingService.getEditProfilePage);

router.post("/edit", settingService.postEditProfile);

router.post("/otp", settingService.otpService);

router.get("/dashboard", settingService.getDashboardPage);

router.post("/changePass", settingService.changePasswordService);

export default router;
