import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../models/user.js";
import bcrypt from "bcrypt";

passport.use(new LocalStrategy(
    async function (email, password, done) {
        const currentUser = await User.findOne({ email: email });
  
      if (!currentUser) {
        return done(null, false, { message: `User with email ${email} does not exist` });
      }
  
      if (currentUser.source != "local") {
        return done(null, false, { message: `You have previously signed up with a different signin method` });
      }
      console.log("currentuser", currentUser)
      if (!bcrypt.compareSync(password, currentUser.password)) {
        return done(null, false, { message: `Incorrect password provided` });
      }
      return done(null, currentUser);
    })
    );

passport.serializeUser((user, done) => {
  done(null, user.email);
});
    
passport.deserializeUser(async (user, done) => {
  const user = await User.findOne({email:email});
  if (!user) {
    return done(null, false);
  }
    return done(null, user.toObject());
});    