const express        = require("express");
const router         = express.Router();
const Roles           = require("../models/Roles");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const checkBoss = checkRoles('BOSS');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', checkBoss, (req, res) => {

  Roles.find().then(roles => {
    res.render('employees/private', {user: req.user, roles});
  })
  .catch((error) => {
    console.log(error);
    res.redirect('/login')
  })
});

router.post("/private", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("employees/private", { message: "Indicate username and password" });
    return;
  }

  Roles.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("employees/private", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new Roles({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("employees/private", { message: "Something went wrong" });
      } else {
        res.redirect("/private");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

router.post('/private/:id/delete', (req, res, next) => {

  let employeeId = req.params.id;
  Roles.findByIdAndRemove(employeeId)
  .then((employee) => {
    if (!employee) {
      return res.status(404).render('not-found');
  }
  console.log('Deleting succes!!');
  res.redirect('/private')
    })
    .catch(next)
});

router.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/courses",
  failureRedirect: "/"
}));

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}
  

module.exports = router;