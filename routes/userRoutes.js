
const express = require('express');

// Require Helpers
const auth = require('../helpers/auth');

// Require UserController
const userController = require('../controllers/userController');

const userRoutes = express.Router();

/* List all users */
userRoutes.get('/', auth.ensureAuthenticated('/login'), userController.list('users/index'));

// EDIT single user by id
userRoutes.get('/:id/edit', auth.ensureAuthenticated('/login'), userController.edit('users/edit'));

// UPDATE single user
userRoutes.post('/:id/update', auth.ensureAuthenticated('/login'), userController.update('/users'));

// CREATE single user by id
// adminRoutes.get('/new', auth.checkCredentials('BOSS', 'back'), userController.create);

// SAVE USER
// adminRoutes.post('/new', auth.checkCredentials('BOSS', 'back'), userController.save);

// DELETE USER
// adminRoutes.get('/:id/delete', auth.checkCredentials('BOSS', 'back'), userController.delete);

module.exports = userRoutes;
