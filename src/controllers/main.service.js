import Course from "../models/course.js";

import Category from "../models/category.js";
import Sub_Category from "../models/sub_category.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";
import authenticationMiddleware from "../middlewares/authentication.js";
import mailer from "../utils/mailer.js";
import userAuthorization from "../middlewares/authorization.js";
import mongoose from "mongoose";
let userMail;

const mainService = {
  getHomePage: async (req, res) => {
    const categories = await Category.find().populate("sub_categories").lean();
    req.session.categories = categories;
    const course = await Course.find().sort({ lastUpdate: 1 }).lean().limit(12);
    const newCourse = [];
    while (course.length) newCourse.push(course.splice(0, 4));

    const querryCourse = await Course.find()
      .sort({ totalView: 1 })
      .lean()
      .limit(12);
    const mostViewCourse = [];
    while (querryCourse.length) mostViewCourse.push(querryCourse.splice(0, 4));

    const highlightCourse = await Course.find()
      .sort({ rating: 1 })
      .lean()
      .limit(3);
    const highlightCourse_active = highlightCourse.slice(0, 1);
    const highlightCourse_inactive = highlightCourse.slice(1);

    const categoriesID = await Course.aggregate([
      { $sortByCount: "$category" },
    ]);
    const highlightCategories = [];
    for (let i = 0; i < categoriesID.length; i++) {
      highlightCategories.push(
        await Category.findById(categoriesID[i]._id).lean()
      );
    }
    // console.log(highlightCategories);
    res.render("home", {
      categories: categories,
      newCourse: newCourse,
      mostViewCourse: mostViewCourse,
      highlightCourse_active: highlightCourse_active,
      highlightCourse_inactive: highlightCourse_inactive,
      highlightCategories: highlightCategories,
    });
  },

  getSearchCourses: async (req, res) => {
    try {
      const sort = req.query.sort;
      const limit = 5;
      var nPages;
      const curPage = req.query.page || 1;
      const offset = (curPage - 1) * limit;

      let cat;
      if (req.query.cat) {
        cat = await Sub_Category.findOne({ name: req.query.cat });
      }

      let courses;
      if (req.query.search) {
        courses = await Course.aggregate([
          {
            $search: {
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: "name",
                      query: req.query.search,
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
      } else {
        courses = await Course.find().lean();
      }

      if (sort === "rating") {
        courses.sort(function (a, b) {
          return parseFloat(b.rating) - parseFloat(a.rating);
        });
      } else if (sort === "price") {
        courses.sort(function (a, b) {
          return parseFloat(a.price) - parseFloat(b.price);
        });
      }

      // let main_cat;
      // if (req.query.main_cat) {
      //   main_cat = await Category.findOne({ name: req.query.main_cat })
      //     .populate("sub_categories")
      //     .lean();
      // }

      if (cat) {
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
        courses = removeItemAll(courses, cat);
      }

      if (req.query.rating) {
        function removeItemAll(arr, value) {
          var i = 0;
          while (i < arr.length) {
            if (arr[i].rating < value) {
              arr.splice(i, 1);
            } else {
              ++i;
            }
          }
          return arr;
        }
        courses = removeItemAll(courses, req.query.rating);
      }

      if (req.query.cost) {
        function removeItemAll(arr, value) {
          var i = 0;
          if (value === "paid") {
            while (i < arr.length) {
              if (arr[i].price === 0) {
                arr.splice(i, 1);
              } else {
                ++i;
              }
            }
          } else if (value === "free") {
            while (i < arr.length) {
              if (arr[i].price !== 0) {
                arr.splice(i, 1);
              } else {
                ++i;
              }
            }
          }
          return arr;
        }
        courses = removeItemAll(courses, req.query.cost);
      }

      const total = courses.length;
      let curCourses = [];
      for (let i = offset; i < total; i++) {
        curCourses.push(courses[i]);
        if (curCourses.length === limit) {
          break;
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

      const subCategories = await Sub_Category.find().lean();
      res.render("vwSearchPage/searchPage", {
        courses: curCourses,
        text: req.query.search,

        subCategories: subCategories,
        pageNumbers: pageNumbers,
        total: total,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getLoginPage: async (req, res) => {
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
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    failureFlash: "Tài khoản hoặc mật khẩu không chính xác",
  }),

  signupService: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.findOne({email:email});
      if(!user) {
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
          otpcount: 1,
        });   
      }
    } catch (e) {
      res.send(e);
  }
},

  // lan sau de cai nay o student.service.js de day do

  createCoursePage: async (req, res) => {
    res.render("vwLecturer/createCourse");
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
        res.redirect("/signup");
      } else {
        await User.updateOne({ email: userMail }, { otp_count: otpcount });
        res.render("vwLoginPage/otpPage", {
          title: "Verify",
          noti: "Wrong OTP! Please enter again",
          otpcount: otpcount + 1,
        });
      }
    }
  },

  checkEmail: async function (req, res) {
    const email = req.query.email;
    const user = await User.findOne({email:email});
    if (user === null)
      return res.json(false);
  
    res.json(true);
  }
};

export default mainService;
