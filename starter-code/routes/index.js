const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const {
  getLoginForm,
  getEmployeeSignUpForm,
  getProfile,
  logInUser,
  createEmployee,
  getAllEmployees,
  getEmployee,
  editEmployeeForm,
  editEmployee,
  getStudentSignUpForm,
  createStudent,
  getAllStudents
} = require("./../controllers/index.controllers");
const { catchErrors, isLoggedIn, checkRoles } = require("./../middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", getLoginForm);
router.post("/login", passport.authenticate("local"), logInUser);

router.get("/profile", isLoggedIn, catchErrors(getProfile));
router.get("/profile/edit", isLoggedIn, editEmployeeForm);
router.post("/profile/edit", isLoggedIn, editEmployee);

router.get(
  "/employees",
  checkRoles(["BOSS", "DEVELOPER", "TA"]),
  getAllEmployees
);
router.get("/employees/signup", checkRoles("BOSS"), getEmployeeSignUpForm);
router.post(
  "/employees/signup",
  checkRoles("BOSS"),
  catchErrors(createEmployee)
);
router.get(
  "/employees/:id",
  checkRoles(["BOSS", "DEVELOPER", "TA"]),
  getEmployee
);

router.get("/students", isLoggedIn, getAllStudents);
router.get("/students/signup", getStudentSignUpForm);
router.post("/students/signup", createStudent);

// router.post("/")

module.exports = router;
