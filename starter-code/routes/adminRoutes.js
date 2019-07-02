const { Router } = require("express");
const router = Router();
const { getSignup, postSignup } = require("../controllers/authcontrollers");

router.get("/ironhack", (req, res) => {
  res.render("ironhack");
});
router.get("/signup", getSignup);
router.post("/signup", postSignup);
module.exports = router;
