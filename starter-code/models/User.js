const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
    {
        username: String,
        email: String,
        facebookId: String,
        role: {
            type: String,
            enum: ["Boss","Developer","TA"],
            default: "TA"
        },
        courses:[
            {
                type:Schema.Types.ObjectId,
                ref:'Course'
            }
        ]
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);