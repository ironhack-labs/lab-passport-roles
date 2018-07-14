const bcrypt         = require("bcrypt");
const express        = require("express");
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const checkBoss      = checkRoles('BOSS');
const checkTa        = checkRoles('TA');
const checkDeveloper = checkRoles('DEVELOPER');

const router         = express.Router();
// User model
const User           = require("../models/user");
const Course         = require("../models/course");
// Bcrypt to encrypt passwords
const bcryptSalt     = 10;

router.get('/courses', (req, res, next) => {
  if (req.user.role === "TA") {
    Course.find()
      .then(courses => {
        res.render("ta/courses", { courses });
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    res.redirect('/login');
  };
});
router.get('/course/:id', (req, res, next) => {
  if (req.user.role === "TA") {
    let courseId = req.params.id;
    console.log(courseId);
    Course.findOne({'_id': courseId})
      .then(course => {
        console.log(course);
        res.render("ta/course-detail", { course });
      })
      .catch(error => {
        console.log(error)
      });
  } else {
    res.redirect('/login');
  };
});
router.get('/courses/add', (req, res, next) => {
  if (req.user.role === "TA") {
    res.render("ta/course-add");
  } else {
    res.redirect('/login');
  };
});
router.post('/courses/add', (req, res, next) => {
  if (req.user.role === "TA") {
    const { coursename, duration, tema } = req.body;
    const newCourse = new Course({ coursename, duration, tema });
    newCourse.save()
    .then((course) => {
      res.redirect('/courses');
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    res.redirect('/login');
  };
});
router.get('/courses/edit', (req, res, next) => {
  if (req.user.role === "TA") {
    Course.findOne({_id: req.query.course_id})
    .then((course) => {
      console.log(course);
      res.render("ta/course-edit", { course });
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    res.redirect('/login');
  };
});
router.post('/courses/edit', (req, res, next) => {
  if (req.user.role === "TA") {
    const { coursename, duration, tema } = req.body;
    Course.update({ _id: req.query.course_id}, { $set: { coursename, duration, tema } },
                 { new: true })
    .then((course) => {
      res.redirect('/courses');
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    res.redirect('/login');
  };
});
router.get('/courses/delete', (req, res, next) => {
  if (req.user.role === "TA") {
    Course.findByIdAndRemove({_id: req.query.course_id}, (err, course) => {
      if (err) return res.status(500).send(err);
      const response = {
        message: "Curso eliminado exitosamente",
        id: course._id
      };
      return res.redirect('/courses');
    });
  } else {
    res.redirect('/login');
  };
});

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.user.role === "DEVELOPER") {
    res.render("passport/private", { user: req.user });
  } else {
    res.redirect('/login');
  }
});
router.get("/signup", (req, res, next) => {
  if (req.user.role === "BOSS") {
    User.find().then( users =>{
      console.log(users);
      res.render("passport/signup", { users });
    })
  } else {
    res.redirect('/login');
  };
});
router.post("/signup", (req, res, next) => {
  if (req.user.role === "BOSS") {
    const username = req.body.username;
    const password = req.body.password;
    const role     = req.body.role;
    console.log(role);
    if (username === "" || password === "") {
      res.render("passport/signup", { message: "Indicate username and password" });
      return;
    }
    User.findOne({ username }, "username", (err, user) => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save((err) => {
        if (err) {
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    });
  } else {
    res.redirect('/login');
  };
});
router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));
router.get("/profile", (req, res, next) => {
  console.log(req.user.username);
  res.render('passport/profile');
  // res.render("passport/profile", { user : req.user.username});
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

module.exports = router;
