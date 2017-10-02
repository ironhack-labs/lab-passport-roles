const express = require("express");
const admin = express.Router();

admin.get("/", (req, res, next) => {
  res.render("admin/admin-panel",
  { user: req.user.username });
});

module.exports = admin;
