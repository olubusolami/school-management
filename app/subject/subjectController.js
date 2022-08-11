const Teacher = require("../teachers/teacherModel");
const Subject = require("./subjectModel");

exports.createSubject = async function (req, res) {
  const subjectExist = await Subject.findOne({ name: req.body.name });
  if (subjectExist)
    return res
      .status(400)
      .json("Subject Already Exist. Please assign to a teacher");
  const subject = req.body;
  Subject.create(
    {
      name: subject.name,
      teacher: subject.teacher,
    },
    async (err, newSubject) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      if (subject.teacher) {
        const teacher = await Teacher.findOne({ name: req.body.teacher });
        if (!teacher) return res.status(400).json("teacher not found");
        teacher.subject = teacher.subject || [];
        teacher.subject.push(subject.name);
        await teacher.save();
      }
      return res
        .status(201)
        .json({ message: "new subject created", newSubject });
    }
  );
};

exports.assignTeacherToSubject = async (req, res) => {
  //checking if subject exists
  const subject = await Subject.find({ name: req.body.subject });
  if (!subject) return res.status(400).json("subject is not found");

  //checking teacher via name and assign to a subject
  const teacher = await Teacher.findById(req.params.teacherId);
  if (!teacher) return res.status(400).json("teacher not found");
  teacher.subject = teacher.subject || [];
  if (teacher.subject.indexOf(req.body.subject) >= 0)
    return res.status(400).json("subject is already assigned to a teacher");
  teacher.subject.push(req.body.subject);
  teacher.save();
  return res.status(200).json("subject is assigned to a teacher");
};
