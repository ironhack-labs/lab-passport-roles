const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");

//MIDDLEWARE
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/auth/login");
    }
  };
}

const checkBoss = checkRoles("Boss");
const checkTA = checkRoles("TA");
const checkDeveloper = checkRoles("Developer");

//FACEBOOK
router.get(
  "/callback/facebook",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.json(req.user);
  }
);

router.post(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
  (req, res) => {}
);

//EDITAR USUARIO
router.get("/update/:id", (req, res, next) => {
  const id = req.user.id;
  const action = `/auth/update/${id}`;
  User.findById(id)
    .then(users => {
      res.render("auth/signup", { users, action });
    })
    .catch(e => {
      next(e);
    });
});

router.post("/update/:id", (req, res, next) => {
  const id = req.user.id;
  User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(users => {
      res.redirect(`/auth/detail/${id}`);
    })
    .catch(error => {
      res.render("auth/signup", { users: req.body, error });
    });
});

//DETALLES USUARIO
router.get("/detail/:id", (req, res, next) => {
  const id = req.user.id;
  User.findById(id)
    .then(users => {
      res.render("auth/detail", users);
    })
    .catch(e => next(e));
});

//LOGOUT
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/auth/login");
});

//NEW
router.get("/new", checkBoss, (req, res, next) => {
  res.render("auth/new");
});

router.post("/new", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => {
      res.json(user);
    })
    .catch(e => next(e));
});

//DELETE
router.get("/delete/:id", checkBoss, (req, res, next) => {
  const id = req.user.id;
  User.findByIdAndRemove(id)
    .then(users => {
      res.redirect("/auth/private");
    })
    .catch(e => next(e));
});

//PRIVATE
router.get("/private", checkBoss, (req, res, next) => {
  User.find()
    .then(users => {
      res.render("private", { users });
    })
    .catch(e => next(e));
});

//LOGIN
router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const id = req.user._id;
  const username = req.user.username;
  res.redirect(`/auth/detail/${id}`);
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

//SIGNUP
router.get("/signup", (req, res, next) => {
  const action = `/auth/signup`;
  res.render("auth/signup", { action });
});

router.post("/signup", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => {
      res.json(user);
    })
    .catch(e => next(e));
});

module.exports = router;
