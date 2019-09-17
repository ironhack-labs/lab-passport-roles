const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const Course = require("../models/Course");
const secure = require("../middlewares/secure.mid");

const router = express.Router();
const bcryptSalt = 10;

router.get("/signup", secure.checkRole("BOSS"), (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("signup", { message: "Please indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup", { message: "Username already exists" });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username: username,
        password: hashPass,
        role: role
      });

      newUser
        .save()
        .then(() => res.redirect("/signup"))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);

router.get('/userlist', secure.checkLogin, (req, res, next) => {
  User.find()
   .then(users => {
    res.render('userlist', { users: users })
   })
  ;
});

router.get("/admin", secure.checkRole("BOSS"), (req, res, next) => {
  res.render("admin", { user: req.user });
});

router.get("/ta", secure.checkRole("TA") || secure.checkRole("BOSS"), (req, res, next) => {
  res.render("ta", { user: req.user });
});

router.get("/developer", secure.checkRole("DEVELOPER") || secure.checkRole("BOSS"), (req, res, next) => {
  res.render("developer", { user: req.user });
});

router.get("/editprofile", secure.checkLogin, (req, res, next) => {
  res.render("editprofile", { user: req.user });
});

router.post("/editprofile", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username === "" || password === "") {
    res.render("editprofile", {
      message: "Please indicate username and password"
    });
    return;
  }

  User.findById(req.user._id)
    .then(user => {
      if (user) {
        
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        user.username = username;
        user.password = hashPass;

        user
          .save()
          .then(() => res.redirect("/editprofile"))
          .catch(error => next(error));
      }
    })
    .catch(error => next(error));
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/course", secure.checkRole("TA"), (req, res, next) => {
  res.render("course");
});

router.post("/course", (req, res, next) => {
  const coursename = req.body.coursename;
  const coursecontent = req.body.coursecontent;

  if (coursename === "" || coursecontent === "") {
    res.render("course", { message: "Please indicate course name and content" });
    return;
  }

  Course.findOne({ coursename })
    .then(course => {
      if (course) {
        res.render("course", { message: "Course name already exists" });
      }

      const newCourse = new Course({
        coursename: coursename,
        coursecontent: coursecontent,
      });

      newCourse
        .save()
        .then(() => res.redirect("/course"))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/courselist', secure.checkRole("TA"), (req, res, next) => {
  Course.find()
   .then(courses => {
    res.render('courselist', { courses: courses })
   })
  ;
});

// router.post("/editcourse", (req, res) => {
//   Course.findByIdAndUpdate(req.body._id, req.body).then(updatedCourse => {
//     res.redirect("/courselist");
//   });
// });

// router.get("/editcourse:courseId", secure.checkRole("TA"), (req, res, next) => {
//   res.render("editcourse", { course: req.course });
// });

// router.post("/editcourse:courseId", (req, res, next) => {
//   const coursename = req.body.coursename;
//   const coursecontent = req.body.coursecontent;

//   Course.findById(req.params.courseId)
//     .then(course => {
//       if (course) {

//         course.coursename = coursename;
//         course.coursecontent = coursecontent;

//         course
//           .save()
//           .then(() => res.redirect("/courselist"))
//           .catch(error => next(error));
//       }
//     })
//     .catch(error => next(error));
// });

router.get("/deletecourse/:courseId", secure.checkRole("TA"), (req, res) => {
  Course.findByIdAndDelete(req.params.courseId).then(deletedCourse => {
    res.redirect("/courselist");
  });
});

module.exports = router;
