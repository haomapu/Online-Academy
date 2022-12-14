import Course from "../models/course.js";

import Category from "../models/category.js";
import Sub_Category from "../models/sub_category.js";
import User from "../models/user.js";
import Video from "../models/video.js";
import Lesson from "../models/lesson.js";
import Chapter from "../models/chapter.js";
import bcrypt from "bcrypt";
import passport from "passport";
import mailer from "../utils/mailer.js";

import fs from "fs";
import multer from "multer";

let userMail;

const mainService = {
  getHomePage: async (req, res) => {
    const categories = await Category.find().populate("sub_categories").lean();
    req.session.categories = categories;
    const course = await Course.find({enable: true}).sort({ lastUpdate: 1 }).lean().limit(12);
    const newCourse = [];
    while (course.length) newCourse.push(course.splice(0, 4));

    const querryCourse = await Course.find({enable: true})
      .sort({ totalView: -1 })
      .lean()
      .limit(12);
    const mostViewCourse = [];
    while (querryCourse.length) mostViewCourse.push(querryCourse.splice(0, 4));

    const highlightCourse = await Course.find()
      .sort({ rating: -1 })
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
      const limit = 5;
      var nPages;
      const curPage = req.query.page || 1;
      const offset = (curPage - 1) * limit;

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
              author: 1,
              rating: 1,
              register_count: 1,
              price: 1,
              discount: 1,
              category: 1,
              sub_category: 1,
              enable: 1,
              totalView: 1,
            },
          },
        ]);
        await Course.populate(courses, { path: "author" });
      } else {
        courses = await Course.find().populate("author").lean();
      }

      const sort = req.query.sort;
      if (sort === "rating") {
        courses.sort(function (a, b) {
          return parseFloat(b.rating) - parseFloat(a.rating);
        });
      } else if (sort === "price") {
        courses.sort(function (a, b) {
          return parseFloat(a.price) - parseFloat(b.price);
        });
      }

      let main_cat;
      if (req.query.main_cat) {
        main_cat = await Category.findOne({ name: req.query.main_cat });
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

      let cat;
      if (req.query.cat) {
        cat = await Sub_Category.findOne({ name: req.query.cat });
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

      function removeItemAll(arr) {
        var i = 0;
        while (i < arr.length) {
          if (!arr[i].enable) {
            arr.splice(i, 1);
          } else {
            ++i;
          }
        }
        return arr;
      }
      courses = removeItemAll(courses);

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
          text: req.query.search,
          main_cat: req.query.main_cat,
          cat: req.query.cat,
          sort: req.query.sort,
          cost: req.query.cost,
          rating: req.query.rating,
        });
      }

      const subCategories = await Sub_Category.find().lean();
      res.render("vwSearchPage/searchPage", {
        courses: curCourses,
        text: req.query.search,
        main_cat: req.query.main_cat,

        subCategories: subCategories,
        pageNumbers: pageNumbers,
        total: total,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getLoginPage: async (req, res) => {
    req.session.returnTo = req.headers.referer || "/";
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("vwLoginPage/loginPage", {
        message: req.flash("error"),
      });
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
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    badRequestMessage: "All Fields Need To Be Filled!",
    keepSessionInfo: true,
  }),

  signupService: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.findOne({ email: email });
      if (!user) {
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

  createCoursePage: async (req, res) => {
    res.render("vwLecturer/createCourse");
  },

  addCourse: async (req, res) => {
    // const description = req.body.text.replace(
    //   '<div class="ql-clipboard" contenteditable="true" tabindex="-1"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div>',
    //   ""
    // );

    let curUser;
    if (!req.isAuthenticated()) {
      res.redirect("/login");
      return;
    } else {
      curUser = req.user;
    }


    const storage = multer.diskStorage({
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    const upload = multer({ storage: storage });
    upload.array("video")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error(err);
      } else if (err) {
        console.error(err);
      }
      //xu ly o day
      let count = 0;
      console.log(req.body);
      let chapters = [];

      if(req.body.titleChap !== undefined && req.body.titleChap !== null) {
        for (let i = 0; i < req.body.titleChap.length; i++){
          let lessons = [];
  
          for (let j = 0; j < req.body.nLesson[i]; j++){
            //Video----------------------------
              let video = fs.readFileSync(req.files[count].path);
              let video_enc = video.toString("base64");
              let obj = {
                name: req.body.firstName,
                img: {
                  contentType: "video/mp4",
                  image: new Buffer.from(video_enc, "base64"),
                },
              };
              let newVideo = new Video(obj);
              let savedVideo = await newVideo.save();
              
            //Lesson-----------------------------
            let lesson = {
              name: req.body.titleLes[count],
              video: savedVideo,
            }
            let newLesson = new Lesson(lesson);
            let saveLesson = await newLesson.save();
            lessons.push(saveLesson);
  
            count++;
          }
          //Chapter--------------------
          let chapter = {
            name: req.body.titleChap[i],
            lessons: lessons,
          }
          let newChapter = new Chapter(chapter);
          let saveChapter = await newChapter.save();
          chapters.push(saveChapter);
        }  
      }
      const description = req.body.text.replace(
        '<div class="ql-clipboard" contenteditable="true" tabindex="-1"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div>',
        ""
      );
      const user = await User.findById(curUser._id)
      const category = await Category.findOne({name: req.body.category})
      const sub_category = await Sub_Category.findOne({name: req.body.sub_category})

      const course = {
        name: req.body.name,
        img: req.body.img,
        overview: req.body.overview,
        description: description,
        rating: 5,
        rating_count: 0,
        register_count: 0,
        price: req.body.price,
        discount: req.body.discount,
        chapters: chapters,
        author: user,
        category: category,
        sub_category: sub_category,
      };
      const newCourse = new Course(course);
      const saveCourse = await newCourse.save();
      res.redirect("/course/" + saveCourse.name);
    });
  },

  editCoursePage: async (req, res) => {
    var curUser;
    // if (req.isAuthenticated()) {
    //   curUser = req.user;
    // } else {
    //   res.redirect("/login");
    //   return;
    // }

    const course = await Course.findOne({ name: req.params.id }).populate('chapters').lean();

    const chapters = [];
    var lessons = [];
    if (course && course.chapters) {
      for (let i = 0; i < course.chapters.length; i++){
        for (let j =0; j < course.chapters[i].lessons.length; j++){
        // lesson.push(await Lesson.findById())
        lessons.push({lessons: await Lesson.findById(course.chapters[i].lessons[j]).populate('video').lean()});
        }
        chapters.push({chapter: lessons});
        lessons = [];
      }
    }
    res.render("vwLecturer/editCourse", {
        course: course,
        chapters: chapters,
    });
  },

  updateCourse: async (req, res) => {
    // if (!req.isAuthenticated()){
    //   res.redirect('/login')
    //   return;
    // } else {
    //   curUser = req.user
    // }
    const storage = multer.diskStorage({
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    })
  
    const upload = multer({ storage: storage });
    upload.array('video')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error(err);
      } else if (err) {
        console.error(err);
      }
      //xu ly o day
      let course = await Course.findOne({ name: req.params.id }).populate('chapters').lean();

      let count = 0;
      let nChap;

      let chapters = [];
      
      for (let i = 0; i < req.body.nLesson.length; i++){
        let lessons = [];
        if (course.chapters){
          nChap = course.chapters[i].lessons.length;
          if (course.chapters[i].lessons.length >= req.body.nLesson[i]){
            continue;
          }
        } else {
          nChap = 0;
        }
        
        for (let j = 0; j < req.body.nLesson[i] - nChap; j++){
          //Video----------------------------
            let video = fs.readFileSync(req.files[count].path);
            let video_enc = video.toString("base64");
            let obj = {
              name: req.body.firstName,
              img: {
                contentType: "video/mp4",
                image: new Buffer.from(video_enc, "base64"),
              },
            };
            let newVideo = new Video(obj);
            let savedVideo = await newVideo.save();
            
          //Lesson-----------------------------
          let lesson = {
            name: req.body.titleLes[count],
            video: savedVideo,
          }
          let newLesson = new Lesson(lesson);
          let saveLesson = await newLesson.save();
          lessons.push(saveLesson);

          count++;
        }
        //Chapter--------------------
        if (course.chapters){
          if (i < course.chapters.length){
            const newChap = await Chapter.findByIdAndUpdate(course.chapters[i]._id, {$push: {lessons: {$each: lessons }}}  );
            // await Chapter.updateOne({id: course.chapters[i]._id}, {name: req.body.titleChap[i]});
          } 
        }else {
          let chapter = {
            name: req.body.titleChap[i],
            lessons: lessons,
          }
          let newChapter = new Chapter(chapter);
          let saveChapter = await newChapter.save();
          chapters.push(saveChapter);
        }
      }
      
      const category = await Category.findOne({name: req.body.category})
      const sub_category = await Sub_Category.findOne({name: req.body.sub_category})

      if (course.chapters){
        if (req.body.nLesson.length > course.chapters.length){
          await Course.findByIdAndUpdate(course._id,{ $push: { chapters: { $each: chapters } } })
        }
      } else {
        await Course.findByIdAndUpdate(course._id, {chapters:  chapters })
      }
      
      const description = req.body.text.replace(
        '<div class="ql-clipboard" contenteditable="true" tabindex="-1"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div>',
        ""
      );
      var myDate = new Date();
      const b = await Course.findByIdAndUpdate(course._id, {lastUpdate: myDate})
      const a = await Course.findByIdAndUpdate(course._id, {
        name: req.body.name,
        img: req.body.img,
        overview: req.body.overview,
        description: description,
        price: req.body.price,
        discount: req.body.discount,
        category: category,
        sub_category: sub_category,
      });
      res.redirect('/course/' + course.name);
      
    });
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
    const user = await User.findOne({ email: email });
    if (user === null) return res.json(false);

    res.json(true);
  },
};

export default mainService;
