const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
const Course         = require("../models/course");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin   = require("connect-ensure-login");

//for passport advanced auth
const passport      = require("passport");

const checkRoles = (role) => {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/');
    }
  }
}

const checkDev  = checkRoles('DEVELOPER');
const checkBoss = checkRoles('BOSS');
const checkTA  = checkRoles('TA');
const checkStudet = checkRoles('STUDENT');

/* GET home page */
router.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
  if(req.user.role === 'BOSS')
  {
    User.find()
    .then(users => {
      console.log(users)
      res.render('passport/' + (req.user.role).toLowerCase(), { users });
    })
    .catch(error => {
      console.log(error)
    })
  }
  if(req.user.role === 'TA' || req.user.role === 'DEVELOPER')
  {
    User.find()
    .then(users => {
      console.log(users)
      res.render('passport/profiles', { users });
    })
    .catch(error => {
      console.log(error)
    })
  }
  if(req.user.role === 'STUDENT')
  {
    User.find({role: {$eq: 'STUDENT'}})
    .then(users => {
      console.log(users)
      res.render('passport/profiles', { users });
    })
    .catch(error => {
      console.log(error)
    })
  }
});

router.get("/tas", checkTA, (req, res) => {
  Course.find()
  .then(courses => {
    console.log(courses);
    res.render("passport/courses", { courses });
  })
  .catch(error => {
    console.log(error)
  })
});

router.get("/courses", checkStudet, (req, res) => {
  Course.find({users: {$in:["Ricardo Rea"]}})
  .then(courses => {
    console.log(courses);
    res.render("passport/students", { courses });
  })
  .catch(error => {
    console.log(error)
  })
});

router.get("/courses/add", checkTA, (req, res, next) =>{
  res.render('passport/addcourse');
});

router.post("/courses/add", checkTA, (req, res, next) =>{
  const name = req.body.name;

  if (name === "") {
    res.render("passport/addcourse", {
      errorMessage: "Indicate a name for the course"
    });
    return;
  }

  Course.findOne({ "name": name },
  "name",
  (err, course) => {
    if (course !== null) {
      res.render("passport/addcourse", {
        errorMessage: "The course already exists"
      });
      return;
    }

    const newCourse = Course({
      name,
    });

    newCourse.save((err) => {
      if (err) {
        res.render("passport/addcourse", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/tas");
      }
    });
  });

});

router.get("/courses/edit", (req, res, next) =>{
  var users = [];

  User.find({role: "STUDENT"})
  .then((totalusers)=>{
    users = totalusers;
  })
  .catch((err)=>{
    console.log(err);
  })

  Course.findOne({_id: req.query.course_id})
  .then((course)=>{
      res.render('passport/editcourse', {course,users});
  })
  .catch((err) =>{
    console.log(err);
  });
});

router.post('/courses/edit', (req, res, next) =>{
  const name = req.body.name;
  const username = req.body.username;
  var users = [];
  var userExists = false;

  Course.find({_id: req.query.course_id})
  .then((course)=>{
    console.log("course: " + course);
    console.log("course name: " + course[0].users);
    if(course[0].users != undefined)
    {
      course[0].users.forEach(user => {
        console.log("user --> " + user);
        if(user != username)
        {
          users.push(user);
        }
        else{
          userExists = true;
        }
      });
      
      ////
      console.log("User Exist: " + userExists);

      if(username != "none")
      {
        users.push(username);
      }

      if(userExists)
      {
        console.log("User Exist");
        Course.findOne({_id: req.query.course_id})
        .then((course)=>{
            res.render('passport/editcourse', {course, errorMessage: "User is already in the course"});
        })
        .catch((err)=>{
          console.log(err);
        })
        return;
      }

      if (name === "") {
        console.log("Error name");
        Course.findOne({_id: req.query.course_id})
        .then((course)=>{
            res.render('passport/editcourse', {course, errorMessage: "Indicate a course name to edit"});
        })
        .catch((err)=>{
          console.log(err);
        })
        return;
      }

      Course.update({_id: req.query.course_id},{$set: {name, users}})
      .then(() =>{
        res.redirect('/tas');
      })
      .catch((err) =>{
        console.log(err);
      });
      ////
    }
    else
    {
      if(username != "none")
      {
        users.push(username);
      }

      if (name === "") {
        console.log("Error name");
        Course.findOne({_id: req.query.course_id})
        .then((course)=>{
            res.render('passport/editcourse', {course, errorMessage: "Indicate a course name to edit"});
        })
        .catch((err)=>{
          console.log(err);
        })
        return;
      }

      Course.update({_id: req.query.course_id},{$set: {name, users}})
      .then(() =>{
        res.redirect('/tas');
      })
      .catch((err) =>{
        console.log(err);
      });
    }
  })
  .catch((err)=>{
    console.log(err);
  })
});

router.get("/courses/delete", checkTA, (req, res, next) =>{
  Course.deleteOne({_id: req.query.course_id})
  .then(()=>{
    console.log("course deleted: " + req.query.course_id);
  })
  .catch((err)=>{
    console.log(err);
  });

  res.redirect('/tas');
});

router.get("/signup", checkBoss, (req, res, next) =>{
  res.render('passport/signup');
});

router.post("/signup", (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;
  const role     = req.body.role;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/");
      }
    });
  });

});

//for basic auth with no error flash
// router.get("/login", (req, res, next) => {
//   res.render("passport/login");
// });

//for passport auth, advanced flash error
router.get("/login", (req, res, next) => {
  res.render("passport/login", {"errorMessage": req.flash("error")});
});

//for basic auth
// router.post("/login", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username === "" || password === "") {
//     res.render("passport/login", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }

//   User.findOne({ "username": username }, (err, user) => {
//       if (err || !user) {
//         res.render("passport/login", {
//           errorMessage: "The username doesn't exist"
//         });
//         return;
//       }
//       if (bcrypt.compareSync(password, user.password)) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         res.redirect("/");
//       } else {
//         res.render("passport/login", {
//           errorMessage: "Incorrect password"
//         });
//       }
//   });
// });

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect("/login", );
//   }
// });

//for basic auth
// router.get("/private", (req, res, next) => {
//   var user = req.session.currentUser;
//   //console.log(user);
//   res.render("passport/private", {user});
// });

//for basic auth
// router.get("/logout", (req, res, next) => {
//   req.session.destroy((err) => {
//     // cannot access session here
//     res.redirect("passport/login");
//   });
// });

//for passport auth advanced
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

router.get("/users/delete", checkBoss, (req, res, next) =>{
  User.deleteOne({_id: req.query.user_id})
  .then(()=>{
    console.log("user deleted: " + req.query.user_id);
  })
  .catch((err)=>{
    console.log(err);
  });

  res.redirect('/');
});

router.get("/users/edit", (req, res, next) =>{
  User.findOne({_id: req.query.user_id})
  .then((user)=>{
    if(user.username === req.user.username)
    {
      res.render('passport/profile', {user});
    }
    else
    {
      User.find()
      .then(users => {
        console.log(users)
        res.render('passport/profiles', { users });
      })
      .catch(error => {
        console.log(error)
      })
    }
  })
  .catch((err) =>{
    console.log(err);
  });
});

router.post('/users/edit', (req, res, next) =>{
  const {username, role} = req.body;

  if (username === "") {
    console.log("Error username");
    res.render('passport/profile', {user: req.user, errorMessage: "Indicate a username to edit"});
    return;
  }

  User.update({_id: req.query.user_id},{$set: {username, role}})
  .then(() =>{
    res.redirect('/');
  })
  .catch((err) =>{
    console.log(err);
  });
});

//facebook
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/"
}));

module.exports = router;

