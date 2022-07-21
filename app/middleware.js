const jwt = require("jsonwebtoken");
const config = process.env;
const Admin = require("../app/admin/adminModel");
const Teacher = require("../app/teachers/teacherModel");

const generateToken = async (payload) => {
  try {
    const token = jwt.sign(JSON.stringify(payload), config.TOKEN_SECRET);
    if (token) return { token };
  } catch (error) {
    return { error };
  }
};

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(400).json({ error: "Auhtorization empty" });
  token = token.split(" ")[1];

  if (!token) {
    return res.status(403).send("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    res.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const isAdmin = async (req, res, next) => {
  const admin = await Admin.findOne({ email: res.user.email });
  if (!admin) {
    return res.status(401).json({ message: "Not an Admin User" });
  } else {
    return next();
  }
};

const isTeacher = async (req, res, next) => {
  const teacher = await Teacher.findOne({ email: res.user.email });
  if (!teacher) {
    return res.status(401).json({ message: "Not a Teacher" });
  } else {
    return next();
  }
};
module.exports = {
  generateToken,
  verifyToken,
  isAdmin,
  isTeacher,
};
