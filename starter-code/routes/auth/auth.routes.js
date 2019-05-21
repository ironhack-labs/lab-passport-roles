const express = require("express")
const app = express.Router()
const passport = require("passport");
const User = require("../../models/user.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10



// Login - Get
app.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") })
})
// Login - Post
app.post('/login', passport.authenticate("local", {
  successRedirect: "/auth/employees",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}))


// Create User - Post
app.post('/add', (req, res, next) => {
  const { username, password, role } = req.body

  if (username === "" || password === "") {
    res.render("new", { message: 'Rellena todos los campos' })
    return
  }
  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render('new', { message: 'El usuario ya existe' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        username,
        password: hashPass,
        role
      })

      newUser.save()
        .then(user => { console.log('usuario creado:', user); res.redirect("/auth/employees") })
        .catch(err => res.render("/employees", { message: `Hubo un error: ${err}` }))
    })
})




// Private Areas

function isBossAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Boss") {
    return next()
  } else {
    res.redirect('/auth/employees')
  }
}

function isBoss(req, res) {
  if (req.isAuthenticated() && req.user.role === "Boss") return true
  else return
}

function isEmployee(req, res) {
  if (req.isAuthenticated() && req.user.role !== "Boss") return true
  else return
}

// function userAuthenticated(req, res, next) {
//   if (req.isAuthenticated() && req.user.role === "Boss") {
//     return next()
//   }
//   if (req.isAuthenticated() && (req.user._id == req.params.employee_id)) {
//     return next()
//   }

//   res.redirect('/auth/employees')
// }

function userAuthenticated(req, res) {
  // if (req.isAuthenticated() && req.user.role === "Boss" || (req.user._id == req.params.employee_id)) {
  if (req.isAuthenticated() && (req.user._id == req.params.employee_id)) {
    return true
  }
  else false
}


// Employee - list
app.get('/employees', (req, res, next) => {
  if (isBoss(req, res)) {
    console.log('Boss')
    User.find()
      .then(allEmployees => {
        // if (userAuthenticated(req, res))
        res.render('employees', { employee: allEmployees, boss: true })
        // else
        //   res.render('employees', { employee: allEmployees, boss: true, userLoged: true })
      })
      .catch(error => console.log(error))
  }
  if (isEmployee(req, res)) {
    console.log('usuario')
    console.log(req.user)

    User.find({ role: { $in: ['Developer', 'TA'] } })
      .then(allEmployees => {
        // if (userAuthenticated(req, res)) {
        res.render('employees', { employee: allEmployees, boss: false, employeeLoged: req.user })
        // }
        // else
        // res.render('employees', { employee: allEmployees, boss: false })
      })
      .catch(error => console.log(error))
  }
})

// Employee Edit - Get
app.get('/employee-edit/:employee_id/', (req, res, next) => {
  User.findById(req.params.employee_id)
    .then(theEmployee => res.render('employee-edit', { employee: theEmployee }))
    .catch(error => console.log(error))
})
// Employee Edit - Post
app.post('/employee-edit/:employee_id/', (req, res, next) => {
  const { username, password } = req.body
  User.update({ _id: req.params.employee_id }, { $set: { username, password } })
    .then(theEmployee => res.redirect('/auth/employees'))
    .catch(error => console.log(error))
})


app.get('/add', isBossAuthenticated, (req, res) => {
  res.render('new')
})


app.post('/employees/:employee_id/delete', isBossAuthenticated, (req, res, next) => {
  User.findByIdAndDelete(req.params.employee_id)
    .then(theCelebrity => res.redirect('/auth/employees'))
    .catch(error => console.log(error))
})



module.exports = app
