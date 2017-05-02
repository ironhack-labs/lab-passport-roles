const User        = require("../models/user");
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

module.exports = function (req, res, redirectError, redirectSuccess) {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render(redirectError, { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render(redirectError, { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass,
      role: role
    });

    newUser.save((err) => {
      if (err) {
        res.render(redirectError, { message: "Something went wrong" });
      } else {
        res.redirect(redirectSuccess);
      }
    });
  });
}