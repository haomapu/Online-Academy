import express from "express";
import settingService from "../controllers/setting.service.js";
import authWithRequiredPermission from "../middlewares/auth.mdw.js";

const router = express.Router();

router.get("/", settingService.getSettingsPage);

router.post("/postDesAuthor", settingService.postDesAuthor);

router.get(
  "/courseLecture",
  authWithRequiredPermission(2),
  settingService.getCoursePage
);

router.get("/courseStudent", settingService.getCourseStudentPage);

router.post("/courseStudent/remove", settingService.removeCourseStudentPage);

router.get("/favourite", settingService.getFavourite);

router.post("/favourite/remove", settingService.removeFavorite);

router.get("/profile", settingService.getEditProfilePage);

router.post("/edit", settingService.postEditProfile);

router.post("/otp", settingService.otpService);

router.get("/isSamePass", settingService.isSamePass);

router.get(
  "/dashboard",
  authWithRequiredPermission(3),
  settingService.getDashboardPage
);

router.get(
  "/category",
  authWithRequiredPermission(3),
  settingService.getCategorySetting
);

router.post("/changePass", settingService.changePasswordService);

router.get(
  "/courseAdmin",
  authWithRequiredPermission(3),
  settingService.getCourseAdmin
);

router.post(
  settingService.disableCourse
);

router.post(
  settingService.enableCourse
);

router.get(
  "/studentAdmin",
  authWithRequiredPermission(3),
  settingService.getStudentAdmin
);

router.post(
  settingService.updateRole
);

router.post(
  settingService.lockStudent
);

router.post(
  settingService.unlockStudent
);

router.get(
  "/lecturerAdmin",
  authWithRequiredPermission(3),
  settingService.getLecturerAdmin
);

router.post(
  settingService.studentRole
);

router.post(
  settingService.lockLecturer
);

router.post(
  settingService.unlockLecturer
);

router.post(
  settingService.addCategory
);

router.post(
  settingService.addSubCategory
);

router.post(
  settingService.deleteMainCategory
);

router.post(
  settingService.deleteSubCategory
);

router.post(
  settingService.updateCategory
);

router.post(
  settingService.updateSubCategory
);
export default router;
