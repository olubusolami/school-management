const express = require("express");
const app = express();
const auth = require("../app/middleware");
const teacherController = require("../app/teachers/teacherController");

//Register an user
app.post("/register", teacherController.createTeacher);

//login as an user
app.post("/login", teacherController.loginTeacher);

//get all teacher by admin
app.get("/", auth.verifyToken, auth.isAdmin, teacherController.getTeachers);

//get a teacher by admin
app.get(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  teacherController.getTeacherById
);

//get a teacher by teacher
app.get(
  "/:id",
  auth.verifyToken,
  auth.isTeacher,
  teacherController.getTeacherById
);

//DELETE request
app.delete(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  teacherController.deleteTeacherById
);

module.exports = app;
