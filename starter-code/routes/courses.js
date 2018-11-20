const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/User");
const Cours = require("../models/Cours");

router.get("/", (req, res, next) => {
  Cours.find().then(courses => {
    res.render("courses/courses", { courses });
  });
});


router.post('/newCours', (req, res, next) => {

  const name = req.body.name;
  const description = req.body.description;

  User.findOne({name})
  .then(cours => {
    if (cours !== null) {
      res.render('courses/courses', {message: 'This user already exists.'})
      return;
    }

    const newCours = new Cours({
      name,
      description,
    })

    newCours.save((err) => {
      if (err) {
        res.render('courses/courses', {message: 'Something went wrong'})
      } else {
        res.redirect('/courses');
      }
    })

  })

})

router.get('/:id/delete', (req, res, next) => {
  Cours.findByIdAndRemove({_id: req.params.id})
  .then(() => res.redirect('/courses'))
  .catch(err => console.log(err))
});


module.exports = router;
