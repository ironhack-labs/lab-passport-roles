const { Router } = require("express");
const router = Router();
const checkRole = require("../middlewares/checkRole");
const { ensureLoggedIn } = require("connect-ensure-login");
const { getCreate, postCreate, getAll, getAccount, postAccount, getDelete } = require("../controllers/accounts.controllers");

router.get("/create", checkRole("BOSS"), getCreate);
router.post("/create", checkRole("BOSS"), postCreate);

router.get("/all", ensureLoggedIn({ redirectTo: "/auth/login" }), getAll);

router.get("/:id/delete", checkRole("BOSS", true), getDelete);

router.get("/:id", ensureLoggedIn({ redirectTo: "/auth/login" }), getAccount);
router.post("/:id", checkRole("BOSS", true), postAccount);

module.exports = router;
