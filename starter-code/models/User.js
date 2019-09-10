const {Schema, model} = require('mongoose');
const PLM = require('passport-local-mongoose');
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['Boss', 'Developer', 'TA'],
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

userSchema.plugin(PLM, {usernameField: 'email'});

module.exports = model('User', userSchema);
