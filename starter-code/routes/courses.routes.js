const { Router } = require("express");
const router = Router();
const checkRole = require('../middlewares/checkRole')
const { getCreate, postCreate, getAll, getCourse, postCourse, getDelete } = require("../controllers/courses.controllers");

router.get("/create", checkRole("TA"), getCreate);
router.post("/create", checkRole("TA"), postCreate);

router.get("/all", getAll);

router.get("/:id/delete", checkRole("TA"), getDelete);

router.get("/:id", getCourse);
router.post("/:id", checkRole("TA"), postCourse);

module.exports = router;