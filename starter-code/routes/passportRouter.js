const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user');

const flash = require("connect-flash"); 
const bcrypt= require('bcrypt'); 
const passport = require('passport'); 
const passportLocal = require('passport-local').Strategy; 
const expressSession = require('express-session');

const ensureLogin = require("connect-ensure-login");


passportRouter.use(expressSession({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passportRouter.use(flash());

passport.use(new passportLocal((username, password, next) => {
   console.log(username, password);
   User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log(username, password);
      return next(null, false, { message: "Incorrect password" });
    }
    return next(null, user);
  });
}));

function checkRoles(roles) {
	return function (req, res, next) {
		if (req.isAuthenticated() && roles.includes(req.user.role)) {
			return next();
		} else {
			if (req.isAuthenticated()) {
				res.redirect('/auth/options')
			}	else {
				res.redirect('/')
			}
		}
	}
}

// js curry
const checkBoss = checkRoles(['Boss']);
const checkTA = checkRoles(['TA']);


passportRouter.use(passport.initialize());
passportRouter.use(passport.session());

/* GET home page */
passportRouter.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('index');
});


passportRouter.get("/signup", (req, res) => {  
  res.render("passport/signup", { user: req.user });
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
 
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});



passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/options",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/login", (req, res) => {
  res.render("passport/login", { "message": req.flash("error") });
});

passportRouter.get("/options", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("options", req.user);
});

passportRouter.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

passportRouter.post('/:userId/delete', checkBoss, (req, res, next) => {
  res.redirect(`/users/${req.params.userId}/delete`);
}); 
module.exports = passportRouter;

