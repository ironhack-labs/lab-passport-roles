const express = require('express');

// Require Helpers
const auth = require('../helpers/auth');

// Require UserController
const userController = require('../controllers/userController');

const adminRoutes = express.Router();

/* List all users */
adminRoutes.get('/', auth.checkCredentials('BOSS', 'back'), userController.list('admin/index'));

// EDIT single user by id
adminRoutes.get('/:id/edit', auth.checkCredentials('BOSS', 'back'), userController.edit('admin/edit'));

// UPDATE single user
adminRoutes.post('/:id/update', auth.checkCredentials('BOSS', 'back'), userController.update('/admin'));

// CREATE single user by id
adminRoutes.get('/new', auth.checkCredentials('BOSS', 'back'), userController.create);

// SAVE USER
adminRoutes.post('/new', auth.checkCredentials('BOSS', 'back'), userController.save);

// DELETE USER
adminRoutes.get('/:id/delete', auth.checkCredentials('BOSS', 'back'), userController.delete);

module.exports = adminRoutes;
