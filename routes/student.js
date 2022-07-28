const express = require("express");
const router = express.Router();
const auth = require("../app/middleware");
const studentController = require("../app/student/studentController");

//POST request to /students to register as a new student
router.post("/register", studentController.createStudent);

//login as a student
router.post("/login", studentController.loginStudent);

//GET reqest to /students fetch all student by admin
router.get("/", auth.verifyToken, auth.isAdmin, studentController.getStudents);

//GET reqest to /students fetch all student by teacher
router.get(
  "/list",
  auth.verifyToken,
  auth.isTeacher,
  studentController.getStudents
);

//GET reqest to /student fetch all approved student by admin
router.get(
  "/approved",
  auth.verifyToken,
  auth.isAdmin,
  studentController.getApprovedStudent
);

//GET reqest to /student fetch all approved student by teacher
router.get(
  "/enrolled",
  auth.verifyToken,
  auth.isTeacher,
  studentController.getApprovedStudent
);

//GET request to /paidStudent
router.get(
  "/payment",
  auth.verifyToken,
  auth.isAdmin,
  studentController.paidStudent
);

//GET request /student/:id to fetch a single student
router.get(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  studentController.getStudentById
);

//PUT request
router.put(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  studentController.updateStudentById
);

//DELETE request
router.delete(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  studentController.deleteStudentById
);

module.exports = router;
