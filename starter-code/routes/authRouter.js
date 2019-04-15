const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const mongoose     = require('mongoose');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Require user model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRouter.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

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
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/newEmployee", { message: "Something went wrong" });
      } else {
        res.redirect("/newEmployee");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

//delete
// authRouter.post('/:id/delete', (req, res, next) => {
//   let celebrityId = req.params.id;
//   Celebrity.findByIdAndRemove(celebrityId)
//   .then(() => {
//     res.redirect('/deleteEmployee');
//   })
//   .catch(() => {
//     next();
//   })
// });

//Roles
const checkTa  = checkRoles(['TA']);
const checkDeveloper = checkRoles(['DEVELOPER']);
const checkBoss  = checkRoles(['BOSS']);
const checkAll = checkRoles(['BOSS', 'DEVELOPER' , 'TA']);

authRouter.get('/private', checkAll, (req, res) => {
  res.render('auth/private', {user: req.user});
});

authRouter.get('/newEmployee', checkBoss, (req, res) => {
  res.render('auth/newEmployee', {user: req.user});
});

authRouter.get('/deleteEmployee', checkBoss, (req, res) => {
  User.find({})
  .then((users) => {
    console.log(users);
    res.render('auth/deleteEmployee', {users});
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