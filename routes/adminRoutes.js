const express = require('express');

// Require Helpers
const auth = require('../helpers/auth');

// Require UserController
const userController = require('../controllers/userController');
const adminRoutes = express.Router();

// User Model
const User = require('../models/user');

/* List all users */
adminRoutes.get('/', auth.checkRoles('BOSS', '/login/'), userController.list);

module.exports = adminRoutes;
