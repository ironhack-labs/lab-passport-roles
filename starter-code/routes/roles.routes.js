const express = require("express");
const router = express.Router();


const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser un ${role} para acceder aquí`
})
// const isRole = role => (req, res, next) => req.user && req.user.role === role

router.get('/TA-page', checkRole('TA'), (req, res) => res.render('TA-items', {
  user: req.user
}))
router.get('/developer-page', checkRole('Developer'), (req, res) => res.render('Developer-items', {
  user: req.user
}))
router.get('/boss-page', checkRole('Boss'), (req, res) => res.render('Boss-items', {
  user: req.user
}))
// router.get('/miscelania-page', (req, res) => res.render('conditional-rendering', {
//   isAdmin: isRole('ADMIN')
// }))

module.exports = router