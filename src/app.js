//Import general
import express from "express";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import hbs_sections from "express-handlebars-sections";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import numeral from 'numeral';
import session from 'express-session';
import passport from "passport";
import userAuthorization from "./middlewares/authorization.js";
import cookieSession from "cookie-session"
import LocalStrategy from "passport-local";
import flash from "connect-flash";
//Inport router
import mainRouter from "./routes/main.route.js";
import courseRouter from "./routes/course.route.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";
//Const variable
const app = express();
app.use("/public", express.static("public"));

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 8080;

// Connect MongoDB
dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to MongoDB");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const store = session.MemoryStore();
app.use(session({
  saveUninitialized: false,
  secret: "KEY_SESSION",
  cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 10s
  },
  store
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username: username });

    let state = null;
    try {
      state = await bcrypt.compareSync(password, user.password);
    } catch (ex) {
      console.log("[Error passport]", ex);
    }
    if (!user || !user.password || !state) {
      return done(null, false, { error: "Sai email hoặc mật khẩu" });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await User.findOne({ username: username });
  if (!user) {
    return done(null, false);
  }

  return done(null, user.toObject());
});

//Set up bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "..", "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "..", "node_modules/bootstrap/dist/js"))
);

//Set up view engine
app.engine(
  "hbs",
  engine({
    defaultLayout: "main.handlebars",
    section: hbs_sections(),
    helpers:{
      format_number(val) {
        return numeral(val).format('0,0');
      },
      format_date(date){
        return date.toLocaleString();
      }
    }
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//Router
app.use("/", mainRouter);
app.use("/search", mainRouter);
app.use("/course", courseRouter);
//Start App
app.listen(PORT, function () {
  console.log(`Online Academy listening at http://localhost:${PORT}`);
});
