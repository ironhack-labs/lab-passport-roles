const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Midleware CHECK-ROLES
function checkRoles(role1, role2) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role1 || req.isAuthenticated() && req.user.role === role2) {
      return next();
    }
    console.log('ALERTA! ACESSO NÃO AUTORIZADO');
    res.redirect('/login');
  };
}

const checkDevTa = checkRoles('DEVELOPER', 'TA');

router.get('/user-console', checkDevTa, (req, res, next) => {
  User.find({ role: { $ne: 'BOSS' } })
    .then((user) => {
      res.render('user-platform', { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

// ROTAS ABAIXO NÃO FUNCIONAM. CORRIGIR
// Edit employee role form
router.get('/user-edit/:id', checkDevTa, (req, res) => {
  User.findOne({ _id: req.session.id })
    .then((user) => {
      res.render('user-edit', { user });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Edit employee role POST
router.post('/user-edit', checkDevTa, (req, res) => {
  const { role } = req.body;
  User.update({ _id: req.query.userId }, { $set: { role } })
    .then(() => {
      res.redirect('/user-console');
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
