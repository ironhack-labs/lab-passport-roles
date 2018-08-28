const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");

const Course = require("../models/Course");

router.use(ensureLogin.ensureLoggedIn("/auth/login"));

router.get("/", (req, res, next) => {
  Course.find({}).then(courses => {
    if (courses.length === 0) {
      res.redirect("/courses/create");
    }
    res.render("course/courses", { courses });
  });
});

router.get(
  "/create",
  (req, res, next) => {
    if (req.user.role !== "TA") {
      res.send("Only TAs are allowed to create courses.");
    } else next();
  },
  () => {
    res.render("course/create", { error: req.flash("error") });
  }
);

router.post("/create", (req, res, next) => {
  const { name, teacher, students } = req.body;

  new Course({ name, teacher, students })
    .save()
    .then(result => {
      res.redirect("/courses");
    })
    .catch(err => {
      console.error(err);
      res.send("something went wrong");
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;

  Course.findById(id)
    .then(course => {
      res.render("course/details", { course, error: req.flash("error") });
    })
    .catch(console.error);
});

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;

  Course.findById(id)
    .then(course => {
      res.render("course/edit", course);
    })
    .catch(console.error);
});

router.post("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  const { name, teacher, students } = req.body;

  Course.findByIdAndUpdate(id, {
    name,
    teacher,
    students
  }).then(user => {
    res.redirect("/courses");
  });
});

router.get("/:id/delete", (req, res) => {
  Course.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/courses");
    })
    .catch(console.error);
});

module.exports = router;
