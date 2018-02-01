const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const secure = require('../configs/passport.config');

router.get("/", courseController.index);
router.get("/new", secure.checkRole("TA"), courseController.new);
router.post("/new", secure.checkRole("TA"), courseController.doNew);
router.get("/:id", secure.checkRole("TA"), courseController.courseDetails);
router.get("/:id/edit", secure.checkRole("TA"), courseController.edit);
router.post("/:id/edit", secure.checkRole("TA"), courseController.doEdit);
router.post("/:id/delete", secure.checkRole("TA"), courseController.delete);

module.exports = router;