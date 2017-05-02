
const express = require('express');

// Require Helpers
const auth = require('../helpers/auth');

// Require UserController
const userController = require('../controllers/userController');

const userRoutes = express.Router();

/* List all users */
userRoutes.get('/', auth.ensureAuthenticated('/login'), userController.list('users/index'));

// EDIT single user by id
// adminRoutes.get('/:id/edit', auth.checkCredentials('BOSS', 'back'), userController.edit);

// UPDATE single user
// adminRoutes.post('/:id/update', auth.checkCredentials('BOSS', 'back'), userController.update);

// CREATE single user by id
// adminRoutes.get('/new', auth.checkCredentials('BOSS', 'back'), userController.create);

// SAVE USER
// adminRoutes.post('/new', auth.checkCredentials('BOSS', 'back'), userController.save);

// DELETE USER
// adminRoutes.get('/:id/delete', auth.checkCredentials('BOSS', 'back'), userController.delete);

module.exports = userRoutes;
