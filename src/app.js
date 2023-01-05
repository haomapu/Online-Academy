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
import userAuthentication from "./middlewares/authentication.js";
import cookieSession from "cookie-session"
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import LocalStrategy from "passport-local";
import flash from "connect-flash";
//Inport router
import activate_routes from './middlewares/routes.mdw.js';


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
  resave: true,
  saveUninitialized: true,
  secret: "KEY_SESSION",
  cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 10s
  },
  store
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(userAuthorization());
//app.use(userAuthentication());
app.use(flash());

passport.use(new GoogleStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: 'http://localhost:8080/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  done(null, profile); 
}
));

passport.use(new FacebookStrategy({
  clientID: '470228735287363',
  clientSecret: '2d46470320ab6bf4dcedcb242d0b4742',
  callbackURL: "http://localhost:8080/auth/facebook/callback",
  profileFields: ['email', 'id', 'displayName','name', 'gender', 'picture.type(large)']
},
function(accessToken, refreshToken, profile, cb) {
    cb(null, profile); 
}
));


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
    if(!user.verified) {
      return done(null, false, { error: "Chưa xác nhận OTP"});
    }
    return done(null, user);
  })
);
passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});


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
      },
      round_number(val){
        return Number(val).toFixed(1);
      }
    }
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//Router
activate_routes(app);


app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile'] 
}));
app.get('/auth/google/callback', passport.authenticate('google'), async (req, res) => {
  const curUser = req.user._json;
  const username = curUser.given_name + curUser.family_name;
  const hashedPassword = await bcrypt.hash("secret", 10);
  const email = curUser.sub + "@gmail.com";
  const existedUser = await User.findOne({username: curUser.given_name + curUser.family_name});
  if(!existedUser) {
    const savedUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      otp: "",
      avatar: curUser.picture,
      phone: "",
      fullname: "",
      verified: true,
    });
    await savedUser.save();
  }
  res.redirect('/');
});
//Start App
app.listen(PORT, function () {
  console.log(`Online Academy listening at http://localhost:${PORT}`);
});
