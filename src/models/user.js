import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  fullname: {
    type: String,
  },

  email: {
    type: String,
  },

  role: {
    type: Number,
    default: 1,
  },

  avatar: {
    type: String,
    default:
      "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?fit=300%2C300&ssl=1",
  },

  otp: {
    type: String,
  },

  otp_count: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
