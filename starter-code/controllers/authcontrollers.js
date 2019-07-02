const User = require("../models/User");

exports.getSignup = (req, res) => {
  res.render("../views/signup");
};
exports.postSignup = async (req, res) => {
  const { username, password, type } = req.body;
  await User.register(new User({ username }), password, type);
  res.redirect("/auth/login");
};
exports.getLogin = (req, res) => {
  res.render("auth/login");
};
exports.postLogin = (req, res) => {
  res.redirect("/secret");
};
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
