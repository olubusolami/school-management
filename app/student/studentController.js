const Student = require("./studentModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//register
exports.createStudent = async function (req, res) {
  const emailExist = await Student.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json("Student Already Exist. Please Login");

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

  const student = req.body;
  Student.create(
    {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      password: student.hashedPassword,
      imageUrl: student.imageUrl,
      status: student.status,
    },
    (err, newStudent) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        return res
          .status(200)
          .json({ message: "new student created", newStudent });
      }
    }
  );
};

//login
exports.loginStudent = async function (req, res) {
  //checking if the email exists
  const student = await Student.findOne({ email: req.body.email });
  if (!student) return res.status(400).json("Email is not found");

  //password check
  const validPass = await bcrypt.compareSync(
    req.body.password,
    student.password
  );
  if (!validPass) {
    return res.status(400).json("invalid password");
  } else {
    return res.status(200).json({
      data: student,
    });
  }
};

//GET reqest to /students fetch all student
exports.getStudents = async (req, res) => {
  Student.find({}, (err, students) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else {
      return res.status(200).json({ students });
    }
  });
};

//GET request /student/:id to fetch a single student
exports.getStudentById = async (req, res) => {
  Student.findOne({ _id: req.params.id }, (err, student) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (!student) {
      return res.status(404).json({ message: "student was not found" });
    } else {
      return res.status(200).json({ student });
    }
  });
};

//PUT request
exports.updateStudentById = async (req, res) => {
  Student.findByIdAndUpdate(
    req.params.id,
    {
      stage: req.body.stage,
    },
    (err, student) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else if (!student) {
        return res.status(404).json({ message: "student not found" });
      } else {
        student.save((err, savedstudent) => {
          if (err) {
            return res.status(400).json({ message: err });
          } else {
            return res
              .status(200)
              .json({ message: "student is approved/enrolled successfully" });
          }
        });
      }
    }
  );
};

//DELETE request /student/:id
exports.deleteStudentById = async (req, res) => {
  Student.findOneAndDelete(req.params.id, (err, student) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (!student) {
      return res.status(404).json({ message: "student was not found" });
    } else {
      return res.status(200).json({ message: "student deleted successfully" });
    }
  });
};

//GET reqest to /students fetch all student
exports.getApprovedStudent = async (req, res) => {
  Student.find({ stage: "approved" }, (err, students) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else {
      return res.status(200).json({ students });
    }
  });
};

//GET reqest to /students fetch all paid student
exports.paidStudent = async (req, res) => {
  Student.find({ paid: "yes" }, (err, students) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else {
      return res.status(200).json({ students });
    }
  });
};
