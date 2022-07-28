const Teacher = require("./teacherModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware");

//register;
exports.createTeacher = async function (req, res) {
  const emailExist = await Teacher.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json("Teacher Already Exist. Please Login");

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

  //create a new teacher
  const teacher = new Teacher({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedTeacher = await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(400).json(err);
  }
};

//login
exports.loginTeacher = async function (req, res) {
  //checking if the email exists
  const teacher = await Teacher.findOne({ email: req.body.email });
  if (!teacher) return res.status(400).json("Email is not found");

  //password check
  const validPass = await bcrypt.compareSync(
    req.body.password,
    teacher.password
  );
  if (!validPass) return res.status(400).json("invalid password");

  try {
    const { token, error } = await generateToken(teacher);
    res.status(200).json({
      data: teacher,
      token,
    });
  } catch (err) {
    res.status(400).json({ message: "bad request" });
  }
};

//DELETE request /teacher/:id to fetch a single teacher
exports.deleteTeacherById = async (req, res) => {
  Teacher.findOneAndDelete(req.params.id, (err, teacher) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (!teacher) {
      return res.status(404).json({ message: "teacher was not found" });
    } else {
      return res.status(200).json({ message: "teacher deleted successfully" });
    }
  });
};
