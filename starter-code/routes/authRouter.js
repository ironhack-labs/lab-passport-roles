const express = require("express");
const authRouter = express.Router();
const passport = require("passport");

// Require user model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


//login
authRouter.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

//new employee
authRouter.post("/newEmployee", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "") {
    res.render("auth/newEmployee", { message: "Indicate username, password and role" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/newEmployee", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role: role
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/newEmployee", { message: "Something went wrong" });
      } else {
        res.render("auth/newEmployee", { message: "Added!"});
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

//delete
authRouter.post('/deleteEmployee', (req, res, next) => {
  let employeeId = req.body.id;
  console.log(employeeId);
  User.findByIdAndDelete(employeeId)
  .then(() => {
    res.redirect('/deleteEmployee');
  })
  .catch(() => {
    next();
  })
});

//Roles
const checkTa  = checkRoles(['TA']);
const checkDeveloper = checkRoles(['DEVELOPER']);
const checkBoss  = checkRoles(['BOSS']);
const checkDeveloperAndTa = checkRoles(['DEVELOPER' , 'TA']);
const checkAll = checkRoles(['BOSS', 'DEVELOPER' , 'TA']);

authRouter.get('/private', checkAll, (req, res) => {
  res.render('auth/private', {user: req.user, userDeveloperAndTa: req.user.role == "DEVELOPER" || req.user.role == "TA"});
});

authRouter.get('/newEmployee', checkBoss, (req, res) => {
  res.render('auth/newEmployee', {user: req.user});
});

authRouter.get('/deleteEmployee', checkBoss, (req, res) => {
  User.find({role: {$ne: "BOSS"}})
  .then((users) => {
    res.render('auth/deleteEmployee', {users});
  })
  .catch(() => {
    next();
  })
});

authRouter.get('/editEmployee', checkDeveloperAndTa, (req, res) => {
  User.find({role: {$ne: "BOSS"}})
  .then((users) => {
    res.render('auth/editEmployee', {users});
  })
  .catch(() => {
    next();
  })
});

function checkRoles(roles) {
	return function (req, res, next) {
		if (req.isAuthenticated() && roles.includes(req.user.role)) {
			return next();
		} else {
			if (req.isAuthenticated()) {
				res.redirect('/')
			}	else {
				res.redirect('/login')
			}
		}
	}
}

// Add passport 
authRouter.post("/login", passport.authenticate("local", {
  successRedirect: "private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = authRouter;