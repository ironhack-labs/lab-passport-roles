const router = require('express').Router();
const passport = require('../config/passport'); //se trae passport no importa si es el ya configuramos o solo passport
const User = require('../models/User');

router.get('/signup', (req, res, next) => {
    const config = {
        title: 'Sign Up',
        action: '/signup',
        button: 'Sign up',
        register: true //se pone para que en el form del resgistro aparezca name y lastname
    };
    res.render('auth/form', config);
});

router.post('/signup', async (req, res, next) => {
    try {
        const user = await User.register({ ...req.body }, req.body.password);
        console.log(user);
        res.redirect('/login');
    } catch (e) {
        console.log(e);
        res.send('User already exists');
    }
});

router.get('/login', (req, res, next) => {
    const config = {
        title: 'Login',
        action: '/login',
        button: 'Login'
    };

    res.render('auth/form', config);
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log(req.user, req.session);
    if (req.user.role === 'Boss') {
        res.redirect('/user');
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;