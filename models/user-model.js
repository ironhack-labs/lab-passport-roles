const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema  = new Schema({
    username: { type: String, unique: true, required: true},
    name: { type: String, required: true},
    role: { type: String, enum:["Boss", "Developer", "TA"], required: true},
    encryptedPassword: { type: String, required: true }
},
{
    timestamps: true
});

userSchema.virtual("isBoss").get(function(){
 return this.role === "Boss";
});

userSchema.virtual("isnotBoss").get(function(){
    return this.role !== "Boss";
   });

const User = mongoose.model("User", userSchema);

module.exports = User;