const Admin = require("./adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware");

//register;
exports.createAdmin = async function (req, res) {
  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json("Admin Already Exist. Please Login");

  const validatePassword = (password) => {
    const re =
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{8,}/;
    return re.test(password);
  };
  if (!validatePassword(req.body.password)) {
    return res.status(400).send({
      error:
        "Password must contain at least 8 characters including uppercase, lowercase and special characters",
    });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create a new admin
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedAdmin = await admin.save();
    res.json(admin);
  } catch (err) {
    res.status(400).json(err);
  }
};

//login
exports.loginAdmin = async function (req, res) {
  //checking if the email exists
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(400).json("Email is not found");

  //password check
  const validPass = await bcrypt.compareSync(req.body.password, admin.password);
  if (!validPass) return res.status(400).json("invalid password");

  try {
    const { token, error } = await generateToken(admin);
    res.status(200).json({
      data: admin,
      token,
    });
  } catch (err) {
    res.status(400).json({ message: "bad request" });
  }
};
