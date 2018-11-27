const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/User')
const Course = require('../models/Course')

/* GET home page */
function checkIfIs(role) {
    return function(req, res, next) {
        if (req.user.role === role) return next()
        return res.redirect('/profile')
    }
}


router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    (req, res, next) => {
        res.redirect('/profile')
    })

router.get('/login', (req, res, next) => {
    res.render('auth/login')
});

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    User.register(req.body, req.body.password)
        .then(user => {
            res.json(user)
        })
        .catch(e => next(e))
})

router.get('/profile', (req, res, next) => {
    const user = req.user
    switch (user.role) {
        case 'BOSS':
            res.render('profileBoss',user)
            break;
        case 'TA':
            res.render('profileTa',user)
            break;

        default:
            res.send('alumni profile')
            break;
    }
});

router.get('/newCourse', (req, res, next) => {
    res.render('newCourse')
});

router.post('/newCourse', (req, res, next) => {
    Course.create(req.body).then(
        course => {
            res.redirect('/courseList')
        }
    ).catch(err => {
        res.render('newCourse', {
            message: 'Curso ya en la base'
        })
    })
});

router.get('/courseList/delete/:id', (req, res, next) => {
    const {
        id
    } = req.params
    Course.findByIdAndDelete(id)
        .then(deleted => {
            res.redirect('/courseList')
        }).catch(err => next(err))
})

router.get('/list/delete/:id', (req, res, next) => {
    const {
        id
    } = req.params
    if (id !== '5bfcbafdfd70f80829888220') {
        User.findByIdAndDelete(id)
            .then(deleted => {
                res.redirect('/list')
            }).catch(err => next(err))
    } else res.redirect('/list')
})

router.get('/newEmploye', (req, res, next) => {
    res.render('newEmploye')
});

router.post('/newEmploye', (req, res, next) => {
    User.register(req.body, 'pass123').then(
        user => {
            res.redirect('/list')
        }
    ).catch(err => {
        res.render('newEmploye', {
            message: 'Usuario ya en la base'
        })
    })
});

router.get('/list', checkIfIs('BOSS'), (req, res, next) => {
    User.find().then(users => {

        res.render('list', {
            users
        })
    }).catch(err => {
        console.log(err)
    })
});

router.get('/courseList', checkIfIs('TA'), (req, res, next) => {
    Course.find().then(courses => {
        res.render('courseList', {
            courses
        })
    }).catch(err => {
        console.log(err)
    })
});


module.exports = router;