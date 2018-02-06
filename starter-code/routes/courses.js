const express = require("express");
const router = express.Router();
const course = require("../models/course");

router.get("/", (req, res, next) => {
  Course.find({}, (err, courses) => {
    if (err) return next(err);

    res.render("courses/index", {
      title: "courses",
      courses: courses
    });
  });
});

router.get("/new", (req, res, next) => {
  res.render("courses/new", {
    title: "Create a course",
    course: {}
  });
});

router.post("/", (req, res, next) => {
  const courseInfo = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available
  };

  const newCourse = new Course(courseInfo);

  newCourse.save(err => {
    if (newCourse.errors) {
      return res.render("courses/new", {
        title: "Create a course",
        errors: newCourse.errors,
        course: newCourse
      });
    }
    if (err) {
      return next(err);
    }
    // redirect to the list of courses if it saves
    return res.redirect("/courses");
  });
});

router.get("/:courseId", (req, res, next) => {
  Course.findById(req.params.courseId, (err, course) => {
    if (err) return next(err);
    res.render("courses/show", {
      title: "course details - " + course.name,
      course: course
    });
  });
});

router.get("/:id/edit", (req, res, next) => {
  Course.findById(req.params.id, (err, course) => {
    if (err) return next(err);
    res.render("courses/edit", {
      title: "Edit course - " + course.name,
      course: course
    });
  });
});

router.post("/:id", (req, res, next) => {
  Course.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      startingDate: req.body.startingDate,
      endDate: req.body.endDate,
      level: req.body.level,
      available: req.body.available
    },
    (err, course) => {
      if (err) return next(err);
      res.redirect(`/courses/${req.params.id}`);
    }
  );
});

router.post("/:id/delete", (req, res, next) => {
  Course.findByIdAndRemove(req.params.id, (err, course) => {
    if (err) return next(err);
    res.redirect("/courses");
  });
});

module.exports = router;
