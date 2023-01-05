import Course from "../models/course.js";

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
      res.render("vwSearchPage/searchPage", {
        courses: courses,
        text: req.query.search,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getLoginPage: async (req, res) => {

    // req.session.reqUrl = req.heders.referer || "/";

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
    // successRedirect: req.session.reqUrl,
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
