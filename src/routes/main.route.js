import express from "express";
import mainService from "../controllers/main.service.js";
import multer from "multer";
import authWithRequiredPermission from "../middlewares/auth.mdw.js";

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log(file.originalname);
    console.log("123");
  },
});

var upload = multer({ storage: storage });

router.get("/", mainService.getHomePage);

router.get("/search", mainService.getSearchCourses);

router.get("/login", mainService.getLoginPage);

router.post("/login", mainService.loginService);

router.post("/otp", mainService.otpService);

router.get("/signup", mainService.getSignupPage);

router.post("/signup", mainService.signupService);

router.get("/logout", mainService.logoutService);

router.get(
  "/postCourse",
  authWithRequiredPermission(2),
  mainService.createCoursePage
);

router.post(
  "/postCourse",
  authWithRequiredPermission(2),
  mainService.addCourse
);

router.get("/editCourse/:id", authWithRequiredPermission(2),mainService.editCoursePage);

router.post("/editCourse/:id", authWithRequiredPermission(2), mainService.updateCourse);

router.get("/is-available", mainService.checkEmail);

export default router;
