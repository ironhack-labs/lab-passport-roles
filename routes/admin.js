const express = require('express');
const router  = express.Router();
const passport = require("passport");

const User = require("../models/User");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isBoss = require("../middlewares/isBoss");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// GET list
router.get("/employees", ensureLoggedIn("/"), (req, res, next) => {
  User.find()
    .then( employees => {
      if( req.user.role === "Boss" ) {
        res.render("admin/employees", {employees});
      } else {
        res.render("employee/list", {employees, user:req.user});
      }
    })
})

/* GET signup */
router.get('/add', [ensureLoggedIn("/"), isBoss("/")], (req, res, next) => {
  res.render('admin/add');
});

// POST add
router.post("/add", /* [ensureLoggedIn("/"), isBoss("/")], */ (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if( username === "" || password === "" ) {
    res.render("admin/add", { errorMessage: "Indicate username and password"});
    return;
  }

  User.findOne({username}, "username", (err, user) => {
    if( user !== null) {
      res.render("admin/add", { errorMessage: "The user already exists"});
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
      if(err) {
        res.render("admin/add", {errorMessage: "Something went wrong"});
      } else {
        res.redirect("/");
      }
    })
  })
});

// GET login
router.get("/login", (req, res, next) => {
  res.render("admin/login");
});

// POST login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

router.get("/delete/:id", (req, res, next) => {
  let id = req.params.id;

  User.findByIdAndRemove({"_id": id})
    .then(
      res.redirect("/employees")
    )
    .catch( err => {
      console.log(`Error deleting user ${err}`);
      next(err);
    })
})

router.get("/edit", (req, res, next) => {
  let id = req.user._id;

  User.findOne({"_id":id})
    .then( user => {
      res.render("employee/edit", {user})
    } )
    .catch( err => {
      console.log(`Error retrieving user ${err}`);
      next(err);
    })
})

router.post("/edit", (req, res, next) => {
  let id = req.user._id;

  const { username, role } = req.body;
  const updates = { username, role };
  User.findByIdAndUpdate(id, updates)
    .then( () => {
      res.redirect("/employees");
    })
})

router.get("/profile/:id", (req, res, next) => {
  let id = req.params.id;

  User.findById(id)
    .then( user => {
      res.render("employee/profile", {user})
    })
    .catch( err => {
      console.log(`Error retrieving user ${err}`);
      next(err);
    })
})

module.exports = router;
