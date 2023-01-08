import express from "express";
import mainService from "../controllers/main.service.js";
import multer from "multer";

const router = express.Router();

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
    cb(null, file.originalname);
    }
  });
var upload = multer({ storage: storage});


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

export default router;
