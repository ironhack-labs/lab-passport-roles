const express = require("express");
const Course = require("../models/Course");
const User = require("../models/Users");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLogged");
const { roleCheck } = require("../middlewares/roleCheck");
const passport = require("passport");

router.get("/newcourse", roleCheck("TA"), (req, res, next) => {
  res.render("newcourse");
});

router.get("/allcourses", (req, res, next) => {
  Course.find().then(course => res.render("allcourses", { course }));
});

router.get("/:id", (req, res, next) => {
  let TA = false;
  if (req.user) {
    if (req.user.role == "TA") {
      TA = true;
    }
  }
  Course.findById(req.params.id).then(course =>
    res.render("course", { course, TA })
  );
});

router.get("/:id/edit", roleCheck("TA"), (req, res, next) => {
  Course.findById(req.params.id).then(course =>
    res.render("editcourse", { course })
  );
});

router.post("/newcourse", roleCheck("TA"), (req, res, next) => {
  let { course, courseName } = req.body;
  if (courseName == "" || course == "") {
    res.render("newcourse", {
      error: "You can't submit this"
    });
  } else {
    Course.findOne({ courseName: courseName }, "courseName").then(data => {
      if (data == null) {
        Course.create({
          creator: req.user.username,
          course: course,
          courseName: courseName
        }).then(() => {
          res.render("newcourse", { error: "course succesfully added" });
        });
      } else {
        res.render("newcourse", { error: "course name already taken" });
      }
    });
  }
});
router.post("/:id/edit", roleCheck("TA"), (req, res, next) => {
  Course.findById(req.params.id).then(course => {
    let update = {
      course: req.body.course,
      courseName: req.body.courseName,
      creator: course.creator
    };
    console.log(course)
    if (req.body.course == "") {
      update.course = course.course;
    }
    if (req.body.courseName == "") {
      update.courseName = course.courseName;
    }
  
    Course.findByIdAndUpdate(course._id, {
      course: update.course,
      courseName: update.courseName
    }).then((course) => res.render("course", { course ,error: "Course updated" }));
  });
});

module.exports = router;
