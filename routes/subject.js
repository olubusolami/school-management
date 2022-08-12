const express = require("express");
const router = express.Router();
const auth = require("../app/middleware");
const subjectController = require("../app/subject/subjectController");

//POST request to /subjects to register as a new subject
router.post(
  "/create",
  auth.verifyToken,
  auth.isAdmin,
  subjectController.createSubject
);

router.post(
  "/assign/:teacherId",
  auth.verifyToken,
  auth.isAdmin,
  subjectController.assignTeacherToSubject
);

//register for subject
router.post("/subject", subjectController.chooseSubject);

module.exports = router;
