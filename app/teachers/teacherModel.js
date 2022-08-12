const mongoose = require("mongoose");
const validator = require("validator");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    subject: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teacher", teacherSchema);
