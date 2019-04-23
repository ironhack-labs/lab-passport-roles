/*
1--->>> CREAR MOLDE CON SUPER PODERES '/models/User.js
importar:
    1) mongoose (base de datos)
        const mongoose = require('mongoose')
    2)Schema (molde)
        const Schema = mongoose.Schema
    3) passport-local-mongoose //simplifica crear username y password con passport
        const passportLocalMongoose = require('passport-local-mongoose');

crear Schema:
const userSchema = new Schema({especificaciones})

???? plugin de passport-local-mongoose????? para qué sirve? qué diablos???
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

exportar:
module.exports = mongoose.model('User', userSchema) 
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: String,
    role:{
        type: String,
        enum:['Boss', 'Developer', 'TA']
    }
},{
    timestamps: true,
    versionKey: false
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('User', userSchema) 