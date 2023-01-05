import Course from "../models/course.js";
import Register from "../models/register.js";
import Favorite from "../models/favorite.js";
import User from "../models/user.js";

const settingService = {


    getSettingsPage: async (req, res) => {
        try {
          var curUser;
    
          if (req.isAuthenticated()){
            curUser = req.user;
          } else {
            res.redirect("/login");
            return;
          }
          let user, role;
          if (curUser.hasOwnProperty("_json") ) {
            user = await User.findOne({
              username: curUser._json.given_name + curUser._json.family_name,
            }).lean();
          } else{
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
        const favourite = await Register.find({ student: curUser._id }).lean().skip(offset).limit(limit);
        const total = await Register.find({ student: curUser._id }).count();
    
        if (favourite.length != 0) {
          for (let i = 0; i < favourite.length; i++) {
            var course;
            if (favourite[i].course) {
              course = await Course.findById(favourite[i].course._id);
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
          courses: courses
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
        const favourite = await Favorite.find({ student: curUser._id }).lean().skip(offset).sort({date: -1}).limit(limit);
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
          courses: courses
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
        const result = await Favorite.deleteOne(req.params.id);
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
        const result = await Register.deleteOne(req.params.id);
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
}
export default settingService;
