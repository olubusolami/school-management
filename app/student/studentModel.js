const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
      default: "pending",
    },
    paid: {
      type: String,
      required: true,
      default: "no",
    },
    subject: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Student", studentSchema);
