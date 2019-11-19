const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Curses = require("../models/Curses.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);

const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser un ${role} para acceder aquí`
})
const isRole = role => (req, res, next) => req.user && req.user.role === role

const RoleTABOSSDEVELOPER = role => (req, res, next) => req.user && (req.user.role === "BOSS" || req.user.role === "TA" || req.user.role === "DEVELOPER") ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser un ${role} para acceder aquí`
})
const RoleSTUDENTTABOSSDEVELOPER = role => (req, res, next) => req.user && (req.user.role === "BOSS" || req.user.role === "TA" || req.user.role === "DEVELOPER" || req.user.role === "STUDENT") ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser un ${role} para acceder aquí`
})



// router.get('/viewProfiles', , (req, res) => {
//   res.render('viewProfiles', {
//     user: req.user
//   })
// })
router.get('/viewProfiles', RoleTABOSSDEVELOPER(), (req, res) => {
  User.find()
    .then(allUser => res.render('viewProfiles', {
      users: allUser
    }))
    .catch(err => console.log("Error consultando la BBDD: ", err))
});

router.get('/viewCurses', RoleSTUDENTTABOSSDEVELOPER(), (req, res) => {
  Curses.find()
    .then(allCurses => res.render('viewCurses', {
      cursos: allCurses
    }))
    .catch(err => console.log("Error consultando la BBDD: ", err))
});


// router.get('/viewProfiles', checkRole('TA'), (req, res) => {
//   User.find()
//     .then(allUser => res.render('viewProfiles', {
//       users: allUser
//     }))
//     .catch(err => console.log("Error consultando la BBDD: ", err))
// });

//ACCIONES DEL BOSS
router.get('/add', checkRole('BOSS'), (req, res) => {
  res.render('add', {
    user: req.user
  })
})

router.post('/add', (req, res) => {

  const {
    username,
    password,
    role
  } = req.body

  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
      username,
      password: hashPass,
      role
    })
    .then(x => res.redirect('/'))
    .catch(err => 'error: ' + err)
})

router.get('/delete', checkRole('BOSS'), (req, res) => {
  res.render('delete', {
    user: req.user
  })
})
router.post('/delete', (req, res) => {
  const {
    username,
    role
  } = req.body
  User.findOneAndRemove({
      username,
      role
    })
    .then(res.redirect('/'))
    .catch(err => console.log("Error consultando la BBDD: ", err))
});


//ACCIONES DEL TA
router.get('/addCurses', checkRole('TA'), (req, res) => {
  res.render('addCurses', {
    user: req.user
  })
})

router.post('/addCurses', (req, res) => {

  const {
    name
  } = req.body


  Curses.create({
      name
    })
    .then(x => res.redirect('/'))
    .catch(err => 'error: ' + err)
})

router.get('/deleteCurses', checkRole('TA'), (req, res) => {
  res.render('deleteCurses', {
    user: req.user
  })
})
router.post('/deleteCurses', (req, res) => {
  const {
    name
  } = req.body
  Curses.findOneAndRemove({
      name
    })
    .then(res.redirect('/'))
    .catch(err => console.log("Error consultando la BBDD: ", err))
});




// router.get('/editCurses', checkRole('TA'), (req, res) => {
//   res.render('editCurses', {
//     user: req.user
//   })
// })
// router.post('/editCurses', (req, res) => {
//   const {
//      name
//   } = req.body
//   Curses.findOneAndUpdate({
//       name
//     })
//     .then(res.redirect('/'))
//     .catch(err => console.log('error!!', err))

// })

// router.get('/editor-page', checkRole('EDITOR'), (req, res) => res.render('edit-items', {
//   user: req.user
// }))
// router.get('/admin-page', checkRole('ADMIN'), (req, res) => res.render('administrate-items', {
//   user: req.user
// }))
// router.get('/miscelania-page', (req, res) => res.render('conditional-rendering', {
//   isAdmin: isRole('ADMIN')
// }))

module.exports = router