const express = require('express');
const router  = express.Router();

const Course = require("../models/Course");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isTA = require("../middlewares/isTA");

/* GET list */
router.get('/', [ensureLoggedIn("/"), isTA("/")], (req, res, next) => {
  Course.find()
    .then( courses => {
      res.render("course/list", {courses});
    })
});

/* GET new */
router.get("/new", [ensureLoggedIn("/"), isTA("/")], (req, res, next) => {
  res.render("course/new");
})

/* POST new */
router.post("/new", [ensureLoggedIn("/"), isTA("/")], (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;

  if( name === "" || description === "" ) {
    res.render("course/new", { errorMessage: "Indicate name and description"});
    return;
  }

  Course.findOne({name}, "name", (err, course) => {
    if( course !== null) {
      res.render("course/new", { errorMessage: "The course already exists"});
      return;
    }

    const newCourse = new Course({
      name,
      description
    })

    newCourse.save((err) => {
      if(err) {
        res.render("course/new", {errorMessage: "Something went wrong"});
      } else {
        res.redirect("/course");
      }
    })
  })
})

/* GET edit */
router.get("/edit/:id", (req, res, next) => {
  let id = req.params.id;

  Course.findOne({"_id":id})
    .then( course => {
      res.render("course/edit", {course})
    } )
    .catch( err => {
      console.log(`Error retrieving course ${err}`);
      next(err);
    })
})

/* POST edit */
router.post("/edit/:id", (req, res, next) => {
  let id = req.params.id;

  const { name, description } = req.body;
  const updates = { name, description };
  Course.findByIdAndUpdate(id, updates)
    .then( () => {
      res.redirect("/course");
    })
})

/* GET delete */
router.get("/delete/:id", (req, res, next) => {
  let id = req.params.id;

  Course.findByIdAndRemove({"_id": id})
    .then(
      res.redirect("/course")
    )
    .catch( err => {
      console.log(`Error deleting course ${err}`);
      next(err);
    })
})

router.get("/view/:id", (req, res, next) => {
  let id = req.params.id;

  Course.findById(id)
    .then( course => {
      res.render("course/view", {course})
    })
    .catch( err => {
      console.log(`Error retrieving course ${err}`);
      next(err);
    })
})

module.exports = router;
