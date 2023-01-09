import express from "express";
import mainService from "../controllers/main.service.js";
import upload from "../middlewares/upload.mdw.js"
const router = express.Router();


router.get("/", mainService.getHomePage);

router.get("/test", mainService.test);

router.post("/test", upload.single('picture'), mainService.testUpload);

router.get("/search", mainService.getSearchCourses);

router.get("/login", mainService.getLoginPage);

router.post("/login", mainService.loginService);

router.post("/otp", mainService.otpService);

router.get("/signup", mainService.getSignupPage);

router.post("/signup", mainService.signupService);

router.get("/logout", mainService.logoutService);

router.get("/postCourse", mainService.createCoursePage);

router.post("/postCourse", mainService.addCourse);

router.get("/editCourse/:id", mainService.editCoursePage);

router.post("/editCourse/:id", mainService.updateCourse);

router.get('/is-available', mainService.checkEmail);

export default router;
