const passportLocalMongoose = require('passport-local-mongoose');

const courseSchema = new require('mongoose').Schema({
    name: String
},{
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

courseSchema.plugin(passportLocalMongoose)

module.exports = require('mongoose').model('Course', courseSchema);