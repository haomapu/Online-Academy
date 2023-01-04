import Course from "../models/course.js";
import Feedback from "../models/feedback.js";
import Register from "../models/register.js";
import Favorite from "../models/favorite.js";
import Category from "../models/category.js";
import Sub_Category from "../models/sub_category.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";
import authenticationMiddleware from "../middlewares/authentication.js";
import mailer from "../utils/mailer.js";
import userAuthorization from "../middlewares/authorization.js";

let userMail;

const mainService = {
  getHomePage: async (req, res) => {
    // console.log("home page");
    // console.log(req.session);
    const categories = await Category.find().populate("sub_categories").lean();
    const course = await Course.find().sort({ lastUpdate: 1 }).lean().limit(4);
    res.render("home", {
      categories: categories,
      newCourse: course,
    });
  },

  getSearchCourses: async (req, res) => {
    try {
      const temp = req.query.sort;
      console.log(temp);
      let courses;
      if (req.query.search) {
        if (temp === "rating") {
          courses = await Course.aggregate([
            {
              $search: {
                compound: {
                  should: [
                    {
                      autocomplete: {
                        path: "name",
                        query: req.query.search,
                        score: { boost: { value: 3 } },
                      },
                    },
                    {
                      text: {
                        path: "name",
                        query: req.query.search,
                        fuzzy: { maxEdits: 1 },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                img: 1,
                name: 1,
                overview: 1,
                rating: 1,
                register_count: 1,
                price: 1,
                discount: 1,
              },
            },
            {
              $sort: { rating: -1 },
            },
          ]);
        } else if (temp === "price") {
          courses = await Course.aggregate([
            {
              $search: {
                compound: {
                  should: [
                    {
                      autocomplete: {
                        path: "name",
                        query: req.query.search,
                        score: { boost: { value: 3 } },
                      },
                    },
                    {
                      text: {
                        path: "name",
                        query: req.query.search,
                        fuzzy: { maxEdits: 1 },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                img: 1,
                name: 1,
                overview: 1,
                rating: 1,
                register_count: 1,
                price: 1,
                discount: 1,
              },
            },
            {
              $sort: { price: -1 },
            },
          ]);
        } else {
          courses = await Course.aggregate([
            {
              $search: {
                compound: {
                  should: [
                    {
                      autocomplete: {
                        path: "name",
                        query: req.query.search,
                        score: { boost: { value: 3 } },
                      },
                    },
                    {
                      text: {
                        path: "name",
                        query: req.query.search,
                        fuzzy: { maxEdits: 1 },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                img: 1,
                name: 1,
                overview: 1,
                rating: 1,
                register_count: 1,
                price: 1,
                discount: 1,
              },
            },
          ]);
        }
      } else {
        if (temp === "rating") {
          courses = await Course.find().sort({ rating: -1 }).lean();
        } else if (temp === "price") {
          courses = await Course.find().sort({ price: -1 }).lean();
        } else {
          courses = await Course.find().lean();
        }
      }
      console.log(courses);
      res.render("vwSearchPage/searchPage", {
        courses: courses,
        text: req.query.search,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getCourseDetail: async (req, res) => {
    const top5 = 5;
    const course = await Course.findOne({ name: req.params.id }).lean();
    const top5cate = await Course.find({
      name: { $not: { $eq: req.params.id } },
    })
      .sort({ register_count: -1 })
      .lean()
      .limit(top5);
    const feedbacks = [];
    const curPage = req.query.page || 1;
    const limit = 4;
    const offset = (curPage - 1) * limit;

    const total = await Feedback.find().count();
    var nPages;

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

    const queryFeedback = await Feedback.find({ course: course._id })
      .sort({ time: -1 })
      .skip(offset)
      .limit(limit);

    if (queryFeedback.length != 0) {
      for (let i = 0; i < queryFeedback.length; i++) {
        const content = queryFeedback[i].content;
        var user;
        if (queryFeedback[i].author) {
          user = await User.findById(queryFeedback[i].author._id);
        }
        if (user) {
          feedbacks.push({
            content: content,
            avatar: user.avatar,
            author: user.username,
            star: queryFeedback[i].star,
            time: queryFeedback[i].time.toLocaleString(),
          });
        }
      }
    }

    res.render("vwDetails/details", {
      course: course,
      feedbacks: feedbacks,
      rec: top5cate,
      pageNumbers: pageNumbers,
    });
  },

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
      console.log(curUser._id);
      console.log(req.body);
      await User.updateMany({ _id: curUser._id }, req.body);
      res.redirect("/settings");
    } catch (e) {
      res.send(e);
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
      const newCourses = await Course.find().limit(5).lean();
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

  getLoginPage: async (req, res) => {
    req.session.reqUrl = req.headers.referer || "/";

    console.log(req.session);
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("vwLoginPage/loginPage");
    }
  },

  getSignupPage: async (req, res) => {
    res.render("vwRegisterPage/registerPage");
  },

  logoutService: async (req, res, next) => {
    const url = req.headers.referer || "/";
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(url);
    });
  },

  loginService: passport.authenticate("local", {
    //successRedirect: req.session.reqUrl,
    failureRedirect: "/login",
    failureFlash: true,
    failureFlash: "Tài khoản hoặc mật khẩu không chính xác",
  }),

  signupService: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.findOne({ email: email }).lean();

      if (user) {
        return res.redirect("/signup");
      } else {
        await mailer.sendMail(email);
        const savedUser = new User({
          username: username,
          email: email,
          password: hashedPassword,
          otp: mailer.otp,
          avatar: "",
          phone: "",
          fullname: "",
        });
        await savedUser.save();
        userMail = email;
        res.render("vwLoginPage/otpPage", {
          mail: email,
        });
      }
    } catch (e) {
      res.send(e);
      return res.redirect("/signup");
    }
  },

  // lan sau de cai nay o student.service.js de day do
  feedbackService: async (req, res, next) => {
    try {
      var curUser;
      if (req.isAuthenticated()) {
        curUser = req.user;
      } else {
        res.redirect("/login");
        return;
      }
      if (curUser.hasOwnProperty("_json")) {
        req.body = {
          ...req.body,
          author: await User.findOne({
            username: curUser._json.given_name + curUser._json.family_name,
          }),
        };
      } else {
        req.body = { ...req.body, author: await User.findById(curUser._id) };
      }

      const course = await Course.findOne({ name: req.params.id });

      req.body = { ...req.body, course: course };
      const feedback = new Feedback(req.body);
      await feedback.save();

      const queryRating = await Feedback.find({ course: course._id }).lean();
      var sum = 0;
      for (var x of queryRating) {
        sum += x.star;
        console.log(x);
      }
      const averageStar = sum / queryRating.length;
      await Course.updateOne(
        { _id: course._id },
        { rating: averageStar, rating_count: queryRating.length }
      );

      res.redirect("/course/" + req.params.id);
    } catch (e) {
      res.send(e);
    }
  },

  createCoursePage: async (req, res) => {
    res.render("vwLecturer/createCourse");
  },

  createRegister: async (req, res, next) => {
    var newRegister = {};
    if (req.isAuthenticated()) {
      var user = req.user;
    } else {
      res.redirect("/login/");
      return;
    }
    const student = await User.findById(user._id);
    const course = await Course.findOne({ name: req.params.id });
    newRegister = { ...newRegister, student: student };
    newRegister = { ...newRegister, course: course };
    const createRegister = new Register(newRegister);
    await createRegister.save();
    await Course.updateOne(
      { _id: course._id },
      { register_count: await Register.find({ course: course._id }).count() }
    );

    res.redirect("/course/" + req.params.id);
  },

  getOtpPage: async (req, res) => {
    res.render("vwLoginPage/otpPage");
  },

  createFavorite: async (req, res) => {
    var newFavorite = {};
    if (req.isAuthenticated()) {
      var user = req.user;
    } else {
      res.redirect("/login");
      return;
    }
    const student = await User.findById(user._id);
    const course = await Course.findOne({ name: req.params.id });
    newFavorite = { ...newFavorite, student: student };
    newFavorite = { ...newFavorite, course: course };
    const createFavorite = new Favorite(newFavorite);
    await createFavorite.save();

    res.redirect("/course/" + req.params.id);
  },

  otpService: async (req, res) => {
    const { first, second, third, fourth, fifth, sixth } = req.body;
    const userOtp = `${first}${second}${third}${fourth}${fifth}${sixth}`;
    const user = await User.findOne({ email: userMail });
    const Otp = user.otp;

    if (userOtp.toUpperCase() == Otp.toUpperCase()) {
      await User.updateOne({ email: userMail }, { verified: true });
      res.redirect("/login");
    } else {
      const otpcount = user.otp_count + 1;
      if (otpcount === 3) {
        await mailer.sendMail(userMail);
        await User.updateOne({ email: userMail }, { otp: mailer.otp });
        await User.updateOne({ email: userMail }, { otp_count: 0 });
        res.render("vwLoginPage/otpPage", {
          title: "Verify",
          noti: "You entered your OTP incorrectly 3 times. We've just resent the code to your email",
        });
      } else {
        await User.updateOne({ email: userMail }, { otp_count: otpcount });
        res.render("vwLoginPage/otpPage", {
          title: "Verify",
          noti: "Wrong OTP! Please enter again",
        });
      }
    }
  },
};

export default mainService;
