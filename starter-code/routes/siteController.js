const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require('../models/user');
const Course = require('../models/course');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/bossPage', ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res) => {
  res.render('bossPage', {user: req.user});
  
});

router.get('/courses', (req, res, next) => {
  Course.find({}, (err, courses) => {
    if (err) {
      next(err);
    } else {
      res.render('courses/index', { courses });
    }
  })
})

router.get('/courses/new', (req, res, next) => {
  res.render('courses/new');
})

router.post('/courses', (req, res, next) => {
  const courseInfo = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available,
  };

const newCourse = new Course(courseInfo);
newCourse.save( (err) => {
    if (err) { 
        return next(err) 
    } else {
        res.redirect('/courses');
    }

  });
});

router.get('/courses/:id/edit', (req, res, next) => {
    const courseID = req.params.id;
    Course.findById(courseID, (err, editCourse) => {
        if (err) {
            next(err)
        } else  {
            res.render('courses/edit', {editCourse});
        }
    })
})

router.post('/courses/:id', (req, res, next) => {
    const courseID = req.params.id;
    const updates = {
        name: req.body.name,
        startingDate: req.body.startingDate,
        endDate: req.body.endDate,
        level: req.body.level,
        available: req.body.available,
  };
    Course.findByIdAndUpdate(courseID, updates, (err, editCourse) => {
        if (err) {
            next(err)
        } else {
            res.redirect('/courses');
        }
    })
});

router.post('/courses/:id/delete', (req, res, next) => {
    const courseID = req.params.id;
    Course.findByIdAndRemove(courseID, (err, deleteCourse) => {
        if (err) {
            return next(err); 
        } else {
            res.redirect('/courses');
        }
  });
})

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next(); 
    } else {
      res.redirect('/login')
    }
  }
}







module.exports = router;
