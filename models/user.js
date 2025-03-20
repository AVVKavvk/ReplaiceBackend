const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dufi9bxnq/image/upload/v1731948868/VipinNotes%20Users/dummy.png",
    },
  },
  { timestamps: true}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
