const express = require("express");
const siteController = express.Router();
const Course = require("../models/course");

siteController.get("/", ensureAuthenticated,(req, res, next) => {
  Course.find({}, (err, results) => {
    console.log(results);
    if (err) {
      next(err);
    }
    res.render("logged/courses/show", {
      results
    });
  });
});
// Add - Edit Course

siteController.get("/addCourse", ensureAuthenticated,(req, res, next) => {
  res.render("logged/courses/addCourse");
});

siteController.post("/addCourse", ensureAuthenticated,(req, res, next) => {
  // SAVE data username, password, name, email
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  const available = req.body.available;

  if (name === "" || startingDate === "" ||
    endDate === "" || level === "") {
    res.render("logged/courses/addCourse", {
      errorMessage: "Please, fill all fields"
    });
    return;
  }
  let newCourse = Course({
    name,
    startingDate,
    endDate,
    level,
    available
  });
  newCourse.save((err) => {
    res.redirect("/portal/courses/");
  });
});

// siteController.get("/editCourse", (req, res, next) => {
//   res.render("logged/courses/show");
// });
siteController.get("/:id/edit", ensureAuthenticated,(req, res, next) => {
  Course.findById(req.params.id, (err, results) => {
    if (err) {
      next(err);
    };
    res.render("logged/courses/edit", results);
  });

});

siteController.post("/:id/edit", ensureAuthenticated,(req, res, next) => {
  let editCourse = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available
  };
  Course.findByIdAndUpdate(req.params.id, editCourse, (err, product) => {
    if (err) {
      return next(err);
    }
    res.redirect('/portal/courses');
  });

});

siteController.post("/:id/delete", ensureAuthenticated,(req, res, next) => {
  Course.findByIdAndRemove(req.params.id, (err, product) => {
    if (err) {
      return next(err);
    }
    res.redirect('/portal/courses');
  });

});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role == 'TA') {
    return next();
  } else {
    res.redirect('/portal');
  }
}

module.exports = siteController;
