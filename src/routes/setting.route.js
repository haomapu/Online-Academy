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

router.post(
  "/courseLecture/done/:id",
  authWithRequiredPermission(2),
  settingService.doneCourses
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
  "/courseAdmin/disable/:id",
  authWithRequiredPermission(3),
  settingService.disableCourse
);

router.post(
  "/courseAdmin/enable/:id",
  authWithRequiredPermission(3),
  settingService.enableCourse
);

router.get(
  "/studentAdmin",
  authWithRequiredPermission(3),
  settingService.getStudentAdmin
);

router.post(
  "/studentAdmin/updateRole/:id",
  authWithRequiredPermission(3),
  settingService.updateRole
);

router.post(
  "/studentAdmin/lock/:id",
  authWithRequiredPermission(3),
  settingService.lockStudent
);

router.post(
  "/studentAdmin/unlock/:id",
  authWithRequiredPermission(3),
  settingService.unlockStudent
);

router.get(
  "/lecturerAdmin",
  authWithRequiredPermission(3),
  settingService.getLecturerAdmin
);

router.post(
  "/lecturerAdmin/studentRole/:id",
  authWithRequiredPermission(3),
  settingService.studentRole
);

router.post(
  "/lecturerAdmin/lock/:id",
  authWithRequiredPermission(3),
  settingService.lockLecturer
);

router.post(
  "/lecturerAdmin/unlock/:id",
  authWithRequiredPermission(3),
  settingService.unlockLecturer
);

router.post(
  "/category/add",
  authWithRequiredPermission(3),
  settingService.addCategory
);

router.post(
  "/subcategory/add",
  authWithRequiredPermission(3),
  settingService.addSubCategory
);

router.post(
  "/category/delete",
  authWithRequiredPermission(3),
  settingService.deleteMainCategory
);

router.post(
  "/subcategory/delete",
  authWithRequiredPermission(3),
  settingService.deleteSubCategory
);

router.post(
  "/category/update",
  authWithRequiredPermission(3),
  settingService.updateCategory
);

router.post(
  "/subcategory/update",
  authWithRequiredPermission(3),
  settingService.updateSubCategory
);
export default router;
