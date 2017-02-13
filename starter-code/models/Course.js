/* jshint esversion: 6, node: true */
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    startingDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      required: true
    }
});

const Course = mongoose.model('courses', CourseSchema);
module.exports = Course;
