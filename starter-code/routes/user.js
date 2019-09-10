const router = require('express').Router();
const {createUser, getUsers, getCurrentUser, updateUser, getUser} = require('../controllers/user');
const {catchErrors, checkRole, isAuthenticated} = require('../middlewares');

const roles = ['Boss', 'Developer', 'TA'];

router.get('/user', checkRole(roles), catchErrors(getUsers));

router.get('/user/profile', checkRole(roles), catchErrors(getCurrentUser));
router.get('/user/profile/:id', checkRole(roles), catchErrors(getUser));
router.post('/user/edit/:id', checkRole(roles), catchErrors(updateUser));

router.get('/user/new', checkRole('Boss'), (req, res, next) => {
    res.render('user/new');
});

router.post('/user/new', checkRole('Boss'), catchErrors(createUser));

module.exports = router;