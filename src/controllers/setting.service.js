import Course from "../models/course.js";
import Register from "../models/register.js";
import Favorite from "../models/favorite.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import mailer from "../utils/mailer.js";
import Category from "../models/category.js";
import Sub_Category from "../models/sub_category.js";

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
      if (user.role === 3) {
        res.render("vwSettingsPage/settingsPage", {
          user: user,
          role: role,
          admin: true,
        });
      }
      if (user.role === 2) {
        res.render("vwSettingsPage/settingsPage", {
          user: user,
          role: role,
          lecturer: true,
        });
      }
      if (user.role === 1) {
        res.render("vwSettingsPage/settingsPage", {
          user: user,
          role: role,
          student: true,
        });
      }
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
    const courseLecture = await Course.find({ author: curUser._id })
      .lean()
      .skip(offset)
      .limit(limit);
    const total = await Course.find({ author: curUser._id }).count();

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
    res.render("vwSettingsPage/vwLecturerPage/courseLecture", {
      course: courseLecture,
      pageNumbers: pageNumbers,
      lecturer: true,
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

    res.render("vwSettingsPage/vwStudentPage/courseStudent", {
      pageNumbers: pageNumbers,
      courses: courses,
      student: true,
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

    res.render("vwSettingsPage/vwStudentPage/favouriteCourse", {
      pageNumbers: pageNumbers,
      courses: courses,
      student: true,
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
      if (user.role === 3) {
        res.render("vwSettingsPage/editPage", {
          user: user,
          role: role,
          admin: true,
        });
      }
      if (user.role === 2) {
        res.render("vwSettingsPage/editPage", {
          user: user,
          role: role,
          lecturer: true,
        });
      }
      if (user.role === 1) {
        res.render("vwSettingsPage/editPage", {
          user: user,
          role: role,
          student: true,
        });
      }
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
      const cats = await Category.find().lean();
      const students = await User.find({ role: 1 }).lean();
      const lecturers = await User.find({ role: 2 }).lean();
      const courses = await Course.find().lean();
      const newStudents = await User.find({ role: 1 }).limit(5).lean();
      const newCourses = await Course.find()
        .populate("author")
        .sort({ lastUpdate: -1 })
        .limit(5)
        .lean();
      res.render("vwSettingsPage/vwAdminPage/dashboardPage", {
        students: students,
        lecturers: lecturers,
        courses: courses,
        newStudents: newStudents,
        newCourses: newCourses,
        admin: true,
        cats: cats,
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
      const equal = await bcrypt.compareSync(oldPass, curUser.password);
      if (equal) {
        const newHashPassword = await bcrypt.hash(newPass, 10);
        await User.updateOne(
          { _id: curUser._id },
          { password: newHashPassword }
        );
        res.redirect("/settings");
      }
    } catch (e) {
      res.send(e);
    }
  },

  getCourseAdmin: async (req, res) => {
    var curUser;
    if (req.isAuthenticated()) {
      curUser = req.user;
    } else {
      res.redirect("/login");
      return;
    }

    let courses;
    courses = await Course.find().populate("author").lean();
    const author = courses.reduce((acc, current) => {
      const x = acc.find(item => item.author === current.author);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    let main_cat;
    if (req.query.main_cat) {
      main_cat = await Category.findOne({ name: req.query.main_cat });
    }

    let cat;
    if (req.query.cat) {
      cat = await Sub_Category.findOne({ name: req.query.cat });
    }

    if (main_cat) {
      function removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
          if (String(arr[i].category) !== String(value._id)) {
            arr.splice(i, 1);
          } else {
            ++i;
          }
        }
        return arr;
      }
      courses = removeItemAll(courses, main_cat);
    }

    if (cat) {
      function removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
          if (String(arr[i].sub_category) !== String(value._id)) {
            arr.splice(i, 1);
          } else {
            ++i;
          }
        }
        return arr;
      }
      courses = removeItemAll(courses, cat);
    }

    let aut;
    if (req.query.author) {
      aut = await User.findOne({ username: req.query.author });
    }

    if (aut) {
      function removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
          if (String(arr[i].author._id) !== String(value._id)) {
            arr.splice(i, 1);
          } else {
            ++i;
          }
        }
        return arr;
      }
      courses = removeItemAll(courses, aut);
    }

    res.render("vwSettingsPage/vwAdminPage/courseAdmin", {
      courses: courses,
      admin: true,
      author: author,
    });
  },

  disableCourse: async (req, res) => {
    await Course.updateOne({ _id: req.params.id }, { enable: false });
    res.redirect("/settings/courseAdmin");
  },

  enableCourse: async (req, res) => {
    await Course.updateOne({ _id: req.params.id }, { enable: true });
    res.redirect("/settings/courseAdmin");
  },

  getStudentAdmin: async (req, res) => {
    var curUser;
    if (req.isAuthenticated()) {
      curUser = req.user;
    } else {
      res.redirect("/login");
      return;
    }

    const limit = 5;
    var nPages;
    const curPage = req.query.page || 1;
    const offset = (curPage - 1) * limit;
    const students = await User.find({ role: 1 })
      .lean()
      .skip(offset)
      .limit(limit);
    const total = await User.find({ role: 1 }).count();

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

    res.render("vwSettingsPage/vwAdminPage/studentAdmin", {
      pageNumbers: pageNumbers,
      students: students,
      admin: true,
    });
  },

  updateRole: async (req, res) => {
    await User.updateOne({ _id: req.params.id }, { role: 2 });
    res.redirect("/settings/studentAdmin");
  },

  lockStudent: async (req, res) => {
    await User.updateOne({ _id: req.params.id }, { verified: false });
    res.redirect("/settings/studentAdmin");
  },

  unlockStudent: async (req, res) => {
    await User.updateOne({ _id: req.params.id }, { verified: true });
    res.redirect("/settings/studentAdmin");
  },

  getLecturerAdmin: async (req, res) => {
    var curUser;
    if (req.isAuthenticated()) {
      curUser = req.user;
    } else {
      res.redirect("/login");
      return;
    }

    const limit = 5;
    var nPages;
    const curPage = req.query.page || 1;
    const offset = (curPage - 1) * limit;
    const lecturers = await User.find({ role: 2 })
      .lean()
      .skip(offset)
      .limit(limit);
    const total = await User.find({ role: 2 }).count();

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

    res.render("vwSettingsPage/vwAdminPage/lecturerAdmin", {
      pageNumbers: pageNumbers,
      lecturers: lecturers,
      admin: true,
    });
  },

  studentRole: async (req, res) => {
    await User.updateOne({ _id: req.params.id }, { role: 1 });
    res.redirect("/settings/LecturerAdmin");
  },

  lockLecturer: async (req, res) => {
    await User.updateOne({ _id: req.params.id }, { verified: false });
    res.redirect("/settings/studentAdmin");
  },

  unlockLecturer: async (req, res) => {
    await User.updateOne({ _id: req.params.id }, { verified: true });
    res.redirect("/settings/studentAdmin");
  },

  isSamePass: async function (req, res) {
    const oldPass = req.query.oldPass;
    const equal = await bcrypt.compareSync(oldPass, req.user.password);
    if (!equal) {
      return res.json(false);
    }
    res.json(true);
  },

  getCategorySetting: async (req, res) => {
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
      res.render("vwSettingsPage/vwAdminPage/categoryAdmin", {
        students: students,
        lecturers: lecturers,
        courses: courses,
        newStudents: newStudents,
        newCourses: newCourses,
        admin: true,
      });
    } catch (e) {
      res.send(e);
    }
  },
  addCategory: async (req, res) => {
    try {
      console.log(req.body);
      res.redirect("/settings/category");
    } catch (e) {
      res.send(e);
    }
  },
};
export default settingService;
