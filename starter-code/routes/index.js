const router = require('express').Router()
const passport = require('../handlers/passport')
const ensureLogin = require('connect-ensure-login')
//const catchErrors = require('../middlewares/catchErrors')
const checkRole = require('../middlewares/checkRole')
const {login, loginForm, logout, profile, staffprofile} = require('../controllers/authcontroller')
const {createUser, createUserForm, deleteUser} = require('../controllers/bosscontrollers')
const {editStaffForm, editStaff, createCourseForm, createCourse, deleteCourse, editCourseForm, editCourse} = require('../controllers/staffcontroller')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', loginForm)
router.post('/login', passport.authenticate('local'), login)
router.get('/profile', checkRole('BOSS'), ensureLogin.ensureLoggedIn(), profile)
router.get('/create-staff',  ensureLogin.ensureLoggedIn(), checkRole('BOSS'), createUserForm)
router.post('/create-staff',  ensureLogin.ensureLoggedIn(), checkRole('BOSS'), createUser)
router.get('/delete-user/:id', ensureLogin.ensureLoggedIn(), checkRole('BOSS'), deleteUser)
//staff
router.get('/staffprofile', checkRole('TA'), ensureLogin.ensureLoggedIn(), staffprofile)
router.get('/edit-staff', checkRole('TA'), ensureLogin.ensureLoggedIn(), editStaffForm)
router.post('/edit-staff', checkRole('TA'), ensureLogin.ensureLoggedIn(), editStaff)
router.get ('/create-course', checkRole('TA'), ensureLogin.ensureLoggedIn(), createCourseForm)
router.post('/create-course', checkRole('TA'), ensureLogin.ensureLoggedIn(), createCourse)
router.get ('/edit-course/:id', checkRole('TA'), ensureLogin.ensureLoggedIn(), editCourseForm)
router.post('/edit-course', checkRole('TA'), ensureLogin.ensureLoggedIn(), editCourse)
router.get('/delete-course/:id', ensureLogin.ensureLoggedIn(), checkRole('TA'), deleteCourse)
router.get('/logout', logout)
//Developer

module.exports = router;
