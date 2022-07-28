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

  //checking teacher via id
  const teacher = await Teacher.findById(req.body.id);
  if (!teacher) return res.status(400).json("id is not assign to a teacher");

  //assign to teacher
  try {
    const teacherSubjectUpdate = await Teacher.findOneAndUpdate(
      { _id: teacher._id },
      { subject: subject.name }
    );
    if (!teacherSubjectUpdate)
      return res
        .status(500)
        .json({ error: "Unable to asign teacher to as subject, Try again!" });
    return res.status(200).json({ message: "subject update is successful" });
  } catch (err) {
    return { error: "Update was unsuccessful" };
  }
};
