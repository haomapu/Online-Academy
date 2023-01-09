import express from "express";
import { set } from "mongoose";
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

router.get("/isSamePass", settingService.isSamePass);

router.get("/dashboard", settingService.getDashboardPage);

router.get("/category", settingService.getCategorySetting);

router.post("/changePass", settingService.changePasswordService);

router.get("/courseAdmin", settingService.getCourseAdmin);

router.post("/courseAdmin/disable/:id", settingService.disableCourse);

router.post("/courseAdmin/enable/:id", settingService.enableCourse);

router.get("/studentAdmin", settingService.getStudentAdmin);

router.post("/studentAdmin/updateRole/:id", settingService.updateRole);

router.post("/studentAdmin/lock/:id", settingService.lockStudent);

router.post("/studentAdmin/unlock/:id", settingService.unlockStudent);

router.get("/lecturerAdmin", settingService.getLecturerAdmin);

router.post("/lecturerAdmin/studentRole/:id", settingService.studentRole);

router.post("/lecturerAdmin/lock/:id", settingService.lockLecturer);

router.post("/lecturerAdmin/unlock/:id", settingService.unlockLecturer);

router.post("/category/add", settingService.addCategory);

router.post("/subcategory/add", settingService.addSubCategory);

router.post("/category/delete", settingService.deleteMainCategory);

router.post("/subcategory/delete", settingService.deleteSubCategory);

router.post("/category/update", settingService.updateCategory);

router.post("/subcategory/update", settingService.updateSubCategory);
export default router;
