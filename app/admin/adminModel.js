const mongoose = require("mongoose");
const validator = require("validator");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Your full name is required."],
  },
  email: {
    type: String,
    required: [true, "Email address is required."],
    validate: [validator.isEmail, "Please provide a valid email address."],
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
