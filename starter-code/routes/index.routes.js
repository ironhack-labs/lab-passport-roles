const express = require('express');
const router = express.Router();
const User = require("../models/user.model")
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
const isBoss = (user) => user && user.role === "Boss"
const isEmployee = (user) => user && user.role === "TA" || user.role === "Developer" || user.role === "Boss"
// Comprobar si un usuario tiene la sesión inciada
const checkLoggedIn = (req, res, next) => req.user ? next() : res.render('index', {
  loginErrorMessage: 'Zona restringida a usuarios registrados'
})

router.get('/', (req, res) => {
  console.log(isBoss(req.user), "holi")
  res.render('index', {
    isBoss: isBoss(req.user),
    isEmployee: isEmployee(req.user)
  })
})

router.get("/profile", checkLoggedIn, (req, res) => res.render("profile", {
  user: req.user,
  isBoss: isBoss(req.user),
  isEmployee: isEmployee(req.user)
}));

//editor
router.get('/employee-edit', (req, res) => {

  const userId = req.query.userId
  console.log(req.query)
  User.findById(userId)
    .then(theUser => res.render('/employee-edit', theUser))

    .catch(err => console.log(err))
})
router.post('/employee-edit/:userId', (req, res) => {
  const userId = req.params.userId
  console.log("EL Id del user que llega como URL param es:", req.params.userId)
  User.findByIdAndUpdate(userId, req.body, {
      new: true
    })
    .then(x => res.redirect(`../profile/${userId}`))
    .catch(err => console.log(err))
})
module.exports = router;