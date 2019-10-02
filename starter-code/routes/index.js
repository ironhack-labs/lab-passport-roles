const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use("/user", userRoutes);

module.exports = router;
