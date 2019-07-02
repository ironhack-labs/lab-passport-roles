const { Router } = require("express");
const router = Router();
const checkRole = require('../middlewares/checkRole')
const { getCreate, postCreate, getAll, getAccount, postAccount, getDelete } = require("../controllers/accounts.controllers");

router.get("/create", checkRole("BOSS"), getCreate);
router.post("/create", checkRole("BOSS"), postCreate);

router.get("/all", getAll);

router.get("/:id/delete", checkRole("BOSS", true), getDelete);

router.get("/:id", getAccount);
router.post("/:id", checkRole("BOSS", true), postAccount);

module.exports = router;
