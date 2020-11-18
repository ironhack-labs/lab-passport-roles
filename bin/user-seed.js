const mongoose = require('mongoose')
const User = require('../models/User.model')

mongoose.connect('mongodb://localhost/passport-roles')

const userBoss = {
    username: 'mark',
    name: 'Mark',
    password: 'mark',
    role: 'BOSS'
    
}