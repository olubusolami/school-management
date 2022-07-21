const express = require("express");
const app = express();
const auth = require("../app/middleware");
const teacherController = require("../app/teachers/teacherController");

//Register an user
app.post("/register", teacherController.createTeacher);

//login as an user
app.post("/login", teacherController.loginTeacher);

//DELETE request
app.delete(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  teacherController.deleteTeacherById
);

module.exports = app;
