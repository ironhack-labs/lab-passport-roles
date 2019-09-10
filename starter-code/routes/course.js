const router = require('express').Router();
const {getCourse, getCourses, updateCourse, createCourse, editCourse, deleteCourse} = require('../controllers/course');
const {catchErrors, checkRole, isAuthenticated} = require('../middlewares');

router.get('/course', checkRole('TA'), catchErrors(getCourses));

router.get('/course/new', checkRole('TA'), (req, res, next) => {
    res.render('course/new');
});

router.post('/course/new', checkRole('TA'), catchErrors(createCourse));

router.get('/course/:id', checkRole('TA'), catchErrors(getCourse));

router.get('/course/edit/:id', checkRole('TA'), editCourse);

router.post('/course/edit/:id', checkRole('TA'), catchErrors(updateCourse));

router.get('/course/delete/:id', checkRole('TA'), catchErrors(deleteCourse));
module.exports = router;