const { Router } = require("express");
const router = Router();
const checkRole = require('../middlewares/checkRole')
const { ensureLoggedIn } = require("connect-ensure-login");
const { getCreate, postCreate, getAll, getCourse, postCourse, getDelete } = require("../controllers/courses.controllers");

router.get("/create", checkRole("TA"), getCreate);
router.post("/create", checkRole("TA"), postCreate);

router.get("/all", ensureLoggedIn({ redirectTo: "/auth/login" }), getAll);

router.get("/:id/delete", checkRole("TA"), getDelete);

router.get("/:id", ensureLoggedIn({ redirectTo: "/auth/login" }), getCourse);
router.post("/:id", checkRole("TA"), postCourse);

module.exports = router;