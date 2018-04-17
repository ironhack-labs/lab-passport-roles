const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const passport = require("passport");
const flash = require("connect-flash");
const isAdmin = require("../middlewares/isBoss");
const User = require("../models/user");


//Pagina principal Admin
router.get("/", [ensureLoggedIn("/login"), isAdmin("/")], (req, res) => {
  User.find()
    .then(users => res.render("../views/boss/index", { users }))
    .catch(err => console.log(err));
});

//Crear Nuevo Empleado
router.get("/new", [ensureLoggedIn("/login"), isAdmin("/")], (req, res) => {
  res.render("../views/boss/new");
});

router.post("/new", (req, res) => {
  console.log(req.body);
  let { username, password, role } = req.body;
  const user = new User({ username, password, role });
  user.save().then(() => res.redirect("/admin"))
  .catch(err => res.render("error", err))
});

//Borrar empleado
router.post("/:id", [ensureLoggedIn("/login"), isAdmin("/")], (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(users => res.redirect("/admin"))
    .catch(err => console.log(err))
});


module.exports = router;
