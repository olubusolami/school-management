const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./database");
const homeRoute = require("./routes/home");
const adminRoute = require("./routes/admin");
const studentRoute = require("./routes/student");
const teacherRoute = require("./routes/teacher");
const paymentRoute = require("./routes/payment");
const subjectRoute = require("./routes/subject");

(async function db() {
  connection();
})();

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//middleware
app.use(express.json());

//Routes
app.get("/", homeRoute);
app.use("/admin", adminRoute);
app.use("/teacher", teacherRoute);
app.use("/student", studentRoute);
app.use("/", paymentRoute);
app.use("/", subjectRoute);

//404 error
app.use((req, res, next) => {
  res.status(404).json({
    message: "Ohh you are lost, go back now!!!!",
  });
});

port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening carefully"));
