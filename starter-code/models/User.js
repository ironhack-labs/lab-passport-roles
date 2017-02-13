/* jshint esversion: 6, node: true */
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: {
      type: String,
      required: true
    },
    familyName: {
      type: String,
      required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA'],
        default: 'TA'
    }
});

const User = mongoose.model('users', UserSchema);
module.exports = User;
