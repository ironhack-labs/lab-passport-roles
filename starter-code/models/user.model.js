const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const ROLE_BOSS = 'BOSS';
const ROLE_DEVELOPER = 'DEVELOPER';
const ROLE_TA = 'TA';
const ROLE_STUDENT = 'STUDENT';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'User needs a password']
    },
    name: {
        type: String
    },
    familyname: {
        type: String
    },
    email: {
        type: String
    },
    social: {
        facebookId: String,
        googleId: String
    },
    role: {
        type: String,
        enum: [ROLE_BOSS, ROLE_DEVELOPER, ROLE_TA, ROLE_STUDENT],
        default: ROLE_TA
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    if (user.isBoss()) {
        user.role = 'BOSS';
    }

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            bcrypt.hash(user.password, salt)
                .then(hash => {
                    user.password = hash;
                    next();
                });
        })
        .catch(error => next(error));
});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.isBoss = function() {
    return this.username === ROLE_BOSS;
};

const User = mongoose.model('User', userSchema);
module.exports = User;