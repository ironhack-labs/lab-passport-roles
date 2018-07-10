const express = require("express");
const router = express.Router();
const Course = require("../models/Course")
const { ensureLoggedIn, hasRole } = require("../middleware/ensureLogin");

router.get("/", ensureLoggedIn("/auth/login"), (req, res, next) => {

  Course.find({})
    .then(courses => {
      res.render("courses/list", { courses });
    })
    .catch(err => {
      next();
    });
});

router.get('/new', [ensureLoggedIn("/auth/login"), hasRole("TA")],(req, res, next) => {
  res.render('courses/new');
});

router.post(
  "/new",
  [ensureLoggedIn("/auth/login"), hasRole("TA")],
  (req, res, next) => {
    const { name, duration } = req.body;

    var fieldsPromise = new Promise((resolve, reject) => {
      if (name === "" || duration === "") {
        reject(
          new Error("Indicate a name and duration to create the course")
        );
      } else {
        resolve();
      }
    });

    fieldsPromise
      .then(() => {
        return Course.findOne({ name });
      })
      .then(course => {
        if (course) {
          throw new Error("The course already exists");
        }

        const newCourse = new Course({
          name,
          duration
        });

        return newCourse.save();
      })
      .then(course => {
        res.redirect("/courses");
      })
      .catch(err => {
        res.render("courses/new", {
          errorMessage: err.message
        });
      });
  }
);







module.exports = router;
