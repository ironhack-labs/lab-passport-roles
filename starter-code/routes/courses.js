const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const {
  getAllCourses,
  getCourse,
  createCourseForm,
  createCourse,
  editCourseForm,
  editCourse
} = require("./../controllers/courses.controllers");
const { catchErrors, isLoggedIn, checkRoles } = require("./../middleware");

router.get("/", isLoggedIn, catchErrors(getAllCourses));
router.get("/add", checkRoles("TA"), createCourseForm);
router.post("/add", checkRoles("TA"), createCourse);
router.get("/:id", isLoggedIn, getCourse);
router.get("/:id/edit", checkRoles("TA"), editCourseForm);
router.post("/:id/edit", checkRoles("TA"), editCourse);

module.exports = router;
