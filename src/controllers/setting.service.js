import Course from "../models/course.js";
import Register from "../models/register.js";
import Favorite from "../models/favorite.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import mailer from "../utils/mailer.js";

let userMail;
let newInfo;

const settingService = {
  getSettingsPage: async (req, res) => {
    try {
      var curUser;

      if (req.isAuthenticated()) {
        curUser = req.user;
      } else {
        res.redirect("/login");
        return;
      }
      let user, role;
      if (curUser.hasOwnProperty("_json")) {
        user = await User.findOne({
          username: curUser._json.given_name + curUser._json.family_name,
        }).lean();
      } else {
        user = await User.findById(curUser._id).lean();
      }
      if (user.role == 2) {
        role = "Lecturer";
      } else if (user.role == 3) {
        role = "Admin";
      } else {
        role = "User";
      }
      res.render("vwSettingsPage/settingsPage", {
        user: user,
        role: role,
      });
    } catch (e) {
      res.send(e);
    }
  },

  getCoursePage: async (req, res) => {
    var curUser;
    if (req.isAuthenticated()) {
      curUser = req.user;
    } else {
      res.redirect("/login");
      return;
    }
    const limit = 3;
    var nPages;
    const curPage = req.query.page || 1;
    const offset = (curPage - 1) * limit;
    const courseLecture = await Course.find({ author: curUser.fullname })
      .lean()
      .skip(offset)
      .limit(limit);
    const total = await Course.find({ author: curUser.fullname }).count();

    total % limit != 0
      ? (nPages = Math.ceil(total / limit))
      : (nPages = total / limit);

    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: i === +curPage,
      });
    }
    res.render("vwSettingsPage/courseLecture", {
      course: courseLecture,
      pageNumbers: pageNumbers,
    });
  },

  getCourseStudentPage: async (req, res) => {
    var curUser;
    if (req.isAuthenticated()) {
      curUser = req.user;
    } else {
      res.redirect("/login");
      return;
    }

    const limit = 3;
    var nPages;
    const courses = [];
    const curPage = req.query.page || 1;
    const offset = (curPage - 1) * limit;
    const favourite = await Register.find({ student: curUser._id })
      .lean()
      .sort({ date: -1 })
      .skip(offset)
      .limit(limit);
    const total = await Register.find({ student: curUser._id }).count();

    if (favourite.length != 0) {
      for (let i = 0; i < favourite.length; i++) {
        var course;
        if (favourite[i].course) {
          course = await Course.findById(favourite[i].course._id).lean();
        }
        if (course) {
          courses.push(course);
        }
      }
    }

    total % limit != 0
      ? (nPages = Math.ceil(total / limit))
      : (nPages = total / limit);

    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: i === +curPage,
      });
    }

    res.render("vwSettingsPage/courseStudent", {
      pageNumbers: pageNumbers,
      courses: courses,
    });
  },

  getFavourite: async (req, res) => {
    var curUser;
    if (req.isAuthenticated()) {
      curUser = req.user;
    } else {
      res.redirect("/login");
      return;
    }

    const limit = 3;
    var nPages;
    const courses = [];
    const curPage = req.query.page || 1;
    const offset = (curPage - 1) * limit;
    const favourite = await Favorite.find({ student: curUser._id })
      .lean()
      .sort({ date: -1 })
      .skip(offset)
      .limit(limit);
    const total = await Favorite.find({ student: curUser._id }).count();

    if (favourite.length != 0) {
      for (let i = 0; i < favourite.length; i++) {
        var course;
        if (favourite[i].course) {
          course = await Course.findById(favourite[i].course._id).lean();
        }
        if (course) {
          courses.push(course);
        }
      }
    }

    total % limit != 0
      ? (nPages = Math.ceil(total / limit))
      : (nPages = total / limit);

    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: i === +curPage,
      });
    }

    res.render("vwSettingsPage/favouriteCourse", {
      pageNumbers: pageNumbers,
      courses: courses,
    });
  },

  removeFavorite: async (req, res) => {
    var user;
    if (req.isAuthenticated()) {
      user = req.user;
    } else {
      res.redirect("/login");
      return;
    }
    const course = await Course.findOne({ name: req.body.nameFav });
    const result = await Favorite.deleteOne({ course: course._id });
    res.redirect("/settings/favourite");
  },

  removeCourseStudentPage: async (req, res) => {
    var user;
    if (req.isAuthenticated()) {
      user = req.user;
    } else {
      res.redirect("/login");
      return;
    }
    const course = await Course.findOne({ name: req.body.nameCou });
    const result = await Register.deleteOne({ course: course._id });
    res.redirect("/settings/courseStudent");
  },

  getEditProfilePage: async (req, res) => {
    try {
      var curUser;
      if (req.isAuthenticated()) {
        curUser = req.user;
      } else {
        res.redirect("/login");
        return;
      }
      let user, role;

      if (curUser.hasOwnProperty("_json")) {
        user = await User.findOne({
          username: curUser._json.given_name + curUser._json.family_name,
        }).lean();
      } else {
        user = await User.findById(curUser._id).lean();
      }
      if (user.role == 2) {
        role = "Lecturer";
      } else if (user.role == 3) {
        role = "Admin";
      } else {
        role = "User";
      }
      res.render("vwSettingsPage/editPage", {
        user: user,
        role: role,
      });
    } catch (e) {
      res.send(e);
    }
  },

  postEditProfile: async (req, res) => {
    try {
      var curUser;
      if (req.isAuthenticated()) {
        curUser = req.user;
      } else {
        res.redirect("/login");
        return;
      }

      if (curUser.email !== req.body.email) {
        await mailer.sendMail(req.body.email);
        userMail = curUser.email;
        newInfo = req.body;
        await User.updateOne({ email: userMail }, { otp: mailer.otp });
        res.render("vwSettingsPage/otpPage", {
          mail: newInfo.email,
          otpcount: 1,
        });
      } else {
        await User.updateMany({ _id: curUser._id }, req.body);
        res.redirect("/settings");
      }
    } catch (e) {
      res.send(e);
    }
  },

  otpService: async (req, res) => {
    const { first, second, third, fourth, fifth, sixth } = req.body;
    const userOtp = `${first}${second}${third}${fourth}${fifth}${sixth}`;
    const user = await User.findOne({ email: userMail });
    const Otp = user.otp;

    if (userOtp.toUpperCase() == Otp.toUpperCase()) {
      await User.updateOne({ email: userMail }, newInfo);
      req.user.email = newInfo.email;
      res.redirect("/settings");
    } else {
      const otpcount = user.otp_count + 1;
      if (otpcount === 3) {
        await mailer.sendMail(userMail);
        await User.updateOne({ email: userMail }, { otp: mailer.otp });
        await User.updateOne({ email: userMail }, { otp_count: 0 });
        res.redirect("/settings/profile");
      } else {
        await User.updateOne({ email: userMail }, { otp_count: otpcount });
        res.render("vwSettingsPage/otpPage", {
          title: "Verify",
          noti: "Wrong OTP! Please enter again",
          otpcount: otpcount + 1,
        });
      }
    }
  },

  getDashboardPage: async (req, res) => {
    try {
      var curUser;
      if (req.isAuthenticated()) {
        curUser = req.user;
      } else {
        res.redirect("/login");
        return;
      }

      const students = await User.find({ role: 1 }).lean();
      const lecturers = await User.find({ role: 2 }).lean();
      const courses = await Course.find().lean();
      const newStudents = await User.find({ role: 1 }).limit(5).lean();
      const newCourses = await Course.find()
        .populate("author")
        .sort({ lastUpdate: -1 })
        .limit(5)
        .lean();
      res.render("vwSettingsPage/dashboardPage", {
        students: students,
        lecturers: lecturers,
        courses: courses,
        newStudents: newStudents,
        newCourses: newCourses,
      });
    } catch (e) {
      res.send(e);
    }
  },

  changePasswordService: async (req, res) => {
    try {
      var curUser;
      if (req.isAuthenticated()) {
        curUser = req.user;
      } else {
        res.redirect("/login");
        return;
      }
      const { oldPass, newPass, confirmPass } = req.body;
      var equal = await bcrypt.compareSync(oldPass, curUser.password);
      if (!equal) {
        res.render("vwSettingsPage/editPage", {
          unsuccess: true,
        });
      } else {
        const newHashPassword = await bcrypt.hash(newPass, 10);
        await User.updateOne(
          { _id: curUser._id },
          { password: newHashPassword }
        );
        res.render("vwSettingsPage/editPage", {
          success: true,
        });
      }
    } catch (e) {
      res.send(e);
    }
  },
};
export default settingService;
