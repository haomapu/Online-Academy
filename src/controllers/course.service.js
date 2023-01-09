import Course from "../models/course.js";
import Feedback from "../models/feedback.js";
import Register from "../models/register.js";
import Favorite from "../models/favorite.js";
import Chapter from "../models/chapter.js";
import Lesson from "../models/lesson.js";
import Video from "../models/video.js";
import User from "../models/user.js";
const courseService = {

  getCourseDetail: async function(req, res){
    const top5 = 5;
    const limit = 4;
    var curUser;
    var buy;
    var avatar;

    const course = await Course.findOne({ name: req.params.id }).populate('author').populate('chapters').lean();
    const chapters = [];
    var lessons = [];
    if (course) {
      for (let i = 0; i < course.chapters.length; i++){
        for (let j =0; j < course.chapters[i].lesson.length; j++){
        // lesson.push(await Lesson.findById())
        lessons.push({lessons: await Lesson.findById(course.chapters[i].lesson[j]).populate('video').lean()});
        }
        chapters.push({chapters: lessons});
        lessons = [];
      }
    }
    await  Course.updateOne({name: req.params.id}, {totalView: course.totalView + 1})
    const top5cate = await Course.find({
      name: { $not: { $eq: req.params.id } }}).sort({ register_count: -1 }).lean().limit(top5);
    const feedbacks = [];
    const curPage = req.query.page || 1;
    var offset = (curPage - 1) * limit;

    const total = await Feedback.find({course: course._id}).count();
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
    if ((curPage > nPages || curPage <= 0) && nPages != 0) {
      res.redirect('/course/' + course.name);
      return;
    }
    const queryFeedback = await Feedback.find({ course: course._id }).sort({ time: -1 }).skip(offset).limit(limit);

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
    
    // if (req.query.page){
    //   res.send({
    //     feedbacks: feedbacks,
    //     pageNumbers: pageNumbers,
    //   })
    //   return;
    // }

    if (req.isAuthenticated()) {
      curUser = req.user;
      buy = await Register.find({$and:[ {student: curUser._id}, {course: course._id}]}).lean();
      avatar = curUser.hasOwnProperty("_json")? curUser.photos[0].value : curUser.avatar;
    }

    if (req.query.ajax){
      res.render("vwDetails/details", {
        layout: false,
        course: course,
        feedbacks: feedbacks,
        rec: top5cate,
        pageNumbers: pageNumbers,
        buy: buy,
        avatar: avatar,
        author: course.author,
      });
      return;
    }

    res.render("vwDetails/details", {
      course: course,
      feedbacks: feedbacks,
      rec: top5cate,
      pageNumbers: pageNumbers,
      buy: buy,
      avatar: avatar,
      author: course.author,
      chapters: chapters,
    });
  },


  
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

    const check = await Register.findOne({student: student._id, course: course._id});
    if(!check){
      newRegister = { ...newRegister, student: student };
      newRegister = { ...newRegister, course: course };
      const createRegister = new Register(newRegister);
      await createRegister.save();
      await Course.updateOne(
        { _id: course._id },
        { register_count: await Register.find({ course: course._id }).count() }
      );
    }
    res.redirect("/course/" + req.params.id);
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
    const course = await Course.findOne({ name: req.body.nameFav });

    const check = await Favorite.findOne({student: student._id, course: course._id});
    if(!check){
      newFavorite = { ...newFavorite, student: student };
      newFavorite = { ...newFavorite, course: course };
      const createFavorite = new Favorite(newFavorite);
      await createFavorite.save();
    }
    res.redirect("/course/" + req.params.id);
  },
  
  viewCourse: async (req,res) => {
    const course = await Course.findOne({ name: req.params.id }).populate('author').populate('chapters').lean();
    const chapters = [];
    var lessons = [];
    if (course) {
      for (let i = 0; i < course.chapters.length; i++){
        for (let j =0; j < course.chapters[i].lesson.length; j++){
        // lesson.push(await Lesson.findById())
        lessons.push({lessons: await Lesson.findById(course.chapters[i].lesson[j]).populate('video').lean()});
        }
        chapters.push({chapters: lessons});
        lessons = [];
      }
    }

    res.render("vwDetails/courseDetails",{
      course: course,
      chapters: chapters,
    });
  },
}
export default courseService;
