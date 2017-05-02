const express = require("express");
const courseController = express.Router();
const passport = require("../helpers/passport");
const flash    = require("connect-flash");
const Course = require("../models/course");
const auth = require("../helpers/auth");



courseController.get("/", (req, res, next)=> {
  Course.find({}, (err, courses)=> {
    if(err) next(err);
    res.render("site-routes/courses", {courses});
  });
});





courseController.get("/:id/delete", auth.checkLoggedIn("/logout", "Ta", 1), (req, res, next)=> {

  Course.remove({_id: req.params.id}, (err)=> {
    if(err) next(err);
    res.redirect("/courses");
  });
});






courseController.get("/new", auth.checkLoggedIn("/logout", "Ta", 1), (req, res, next)=> {
  res.render("auth/new");
});

courseController.post("/new",  auth.checkLoggedIn("/logout", "Ta", 1), (req, res, next)=> {
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  Course.findOne({name},"name", (err, course) => {
    if(course !== null){
      res.render("auth/new", {message: "course already exists"});
      return;
    }


    const newCourse = Course({
      name,
      startingDate,
      endDate,
      level,
      available: true,
    });
    newCourse.save((err) => {
      if (err) {
        res.render("auth/new", { message: "Something went wrong" });
      } else {
        res.redirect("/courses");
      }
    });

  });
});

courseController.get("/:id/edit", auth.checkLoggedIn("/logout", "Ta", 1), (req, res, next)=> {
  Course.find({"_id": req.params.id}, (err, course)=> {
    if(err) res.redirect("/logout");
    res.render("auth/edit-course", {course: course[0]});
  });
});


courseController.post("/:id",  auth.checkLoggedIn("/logout", "Ta", 1), (req, res, next)=> {

  const courseInfo = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
  };
  Course.findByIdAndUpdate(req.params.id, courseInfo, (err, course) => {
    if (err) next(err);
    console.log("change saved");
    res.redirect(`/courses`);
  });
});


module.exports = courseController;
