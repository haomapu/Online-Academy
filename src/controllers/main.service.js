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
<<<<<<< HEAD
      const temp = req.query.rating;
      const courses = await Course.aggregate([
        {
          $search: {
            autocomplete: {
              query: req.query.search,
              path: "name",
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
=======
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
>>>>>>> 35a83713f73fcc18604fcf757633468a6f2a388b
      res.render("vwSearchPage/searchPage", {
        courses: courses,
        text: req.query.search,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  

  

  
  

  

  

  

  getLoginPage: async (req, res) => {
    req.session.reqUrl = req.headers.referer || "/";
<<<<<<< HEAD
        if (req.isAuthenticated()) {
=======

    console.log(req.session);
    if (req.isAuthenticated()) {
>>>>>>> 35a83713f73fcc18604fcf757633468a6f2a388b
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
  

  createCoursePage: async (req, res) => {
    res.render("vwLecturer/createCourse");
  },

  

  getOtpPage: async (req, res) => {
    res.render("vwLoginPage/otpPage");
  },

  

  removeCourseStudentPage: async (req, res) => {
    var user;
    if (req.isAuthenticated()) {
      user = req.user;
    } else {
      res.redirect("/login");
      return;
    }
    const result = await Register.deleteOne(req.params.id);
    res.redirect("/settings/courseStudent");
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
