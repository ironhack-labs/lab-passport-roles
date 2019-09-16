const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Employee = require('../models/Employee');
const secure = require('../middlewares/secure.mid');

const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Please indicate username and password' });
    return;
  }

  Employee.findOne({ username })
    .then((employee) => {
      if (employee) {
        res.render('auth/signup', { message: 'Username already exists' });
      } 

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newEmployee = new Employee({
        username,
        password: hashPass,
        role
      });

      newEmployee.save()
        .then(() => res.redirect('/admin'))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local-auth', {
  successRedirect: '/private',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));

router.get('/private', secure.checkLogin, (req, res, next) => {
  res.render('auth/private', { employee: req.user });
});

router.get('/admin', secure.checkRole('Boss'), (req, res, next) => {
  Employee.find({})
    .then(allEmployees =>
      res.render("auth/admin", { employees: allEmployees })
    )
    .catch(error => next(error));
  // res.render('auth/admin', { employee: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get("/staff", (req, res, next) => {
  Employee.find({})
    .then(allEmployees =>
      res.render("auth/staff", { employees: allEmployees })
    )
    .catch(error => next(error));
});

router.get("/:id", (req, res, next) => {
  Employee.findById(req.params.id)
    .then(employeeDetail =>
      res.render("auth/profile", { employee: employeeDetail })
    )
    .catch(error => next(error));
});

router.get("/private/:id/update", (req, res, next) => {
  Employee.findById(req.params.id)
    .then(employeeDetail =>
      res.render("auth/update", { employee: employeeDetail })
    )
    .catch(error => next(error));
});

router.post("/private/:id/update", (req, res) => {
  Employee.findByIdAndUpdate(req.body._id, req.body).then(employeeDetail => {
    res.redirect("/private");
  });
});

router.get("/:id/edit", (req, res, next) => {
  Employee.findById(req.params.id)
    .then(employeeDetail =>
      res.render("auth/edit", { employee: employeeDetail })
    )
    .catch(error => next(error));
});

router.post("/:id/edit", (req, res) => {
  Employee.findByIdAndUpdate(req.body._id, req.body).then(employeeDetail => {
    res.redirect("/admin");
  });
});

router.get("/:id/delete", (req, res, next) => {
  Employee.findByIdAndDelete(req.params.id)
    .then(deletedEmployee => res.redirect("/admin"))
    .catch(error => next(error));
});

module.exports = router;
