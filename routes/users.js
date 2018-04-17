const express = require("express");
const router = express.Router();
const User = require("../models/User");






router.get("/:id/delete", (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/users");
    })
    .catch(err => {
      next();
      return err;
    });
});

module.exports = router;