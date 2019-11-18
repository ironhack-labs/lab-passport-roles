const express = require("express");
const passportRouter = express.Router();

const bodyParser = require('body-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');

const User = require('../models/user')

const bcrypt = require("bcrypt")
const bcryptSalt = 10;

const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const ensureLogin = require("connect-ensure-login");


//////////////////////////////////
//Inicialización de Middleware
/////////////////////////////////

passportRouter.use(bodyParser.json());
passportRouter.use(bodyParser.urlencoded({
  extended: false
}));

passport.use(
  new LocalStrategy({
      passReqToCallback: true
    },
    (req, username, password, next) => {
      User.findOne({
          username
        },
        (err, user) => {
          if (err) {
            return next(err);
          }

          if (!user) {
            return next(null, false, {
              message: "Incorrect username"
            });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, {
              message: "Incorrect password"
            });
          }

          return next(null, user);
        }
      );
    }
  )
);


passportRouter.get("/signup", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/signup');
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.json({
      message: "Something wen wrong"
    })
    return;
  }

  User.findOne({
    username
  })
    .then((user) => {
      if (user !== null) {
        res.json({
          message: "The username already exists"
        })
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
          res.json({message: "Something went wrong"})
        } else {
          res.redirect("/signup");
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

passportRouter.get("/login", (req, res) => {
  res.render('passport/login');
});

passport.serializeUser((user, cb) => {
  console.log("serialize");
  console.log(`storing ${user._id} in the session`);
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  console.log("deserialize");
  console.log(`Attaching ${id} to req.user`);
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use('local-auth',
  new LocalStrategy((username, password, next) => {
      User.findOne(
        {
          username
        },
        (err, user) => {
          if (err) {
            return next(err);
          }

          if (!user) {
            return next(null, false, {
              message: "Incorrect username"
            });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, {
              message: "Incorrect password"
            });
          }

          return next(null, user);
        }
      );
    }
  )
);

passportRouter.post(
  "/login",
  passport.authenticate("local-auth", {
    successReturnToOrRedirect: "/signup",
    failureRedirect: "/login",
    passReqToCallback: true
  })
);

passportRouter.get('/list-of-users', (req, res, next) => {
  User.find()
    .then(usersFound => {
      res.render('passport/list-of-users', {
        usersFound
      })
    })
    .catch((err) => {
      console.log(err)
    })
});

passportRouter.get("/user/:id/delete", (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/list-of-users')
    })
})

passportRouter.get('/user/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(userById => {
      res.render('passport/profile', userById)
    })
    .catch((err) => {
      console.log(err)
    })
})

passportRouter.get("/user/:id/edit", (req, res, next) => {
  User.findByIdAndUpdate(req.params.id)
    .then(userById => {
      res.render('passport/edit', userById)
    })
    .catch((err) => {
      console.log(err)
    })
})

passportRouter.post("/user/:id/edit", (req, res, next) => {
  let updatedUser = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  }

  User.findByIdAndUpdate(req.params.id, updatedUser)
    .then(() => {
      res.redirect(`/user/${req.params.id}`)
    })
    .catch(error => next(error))
})


module.exports = passportRouter;