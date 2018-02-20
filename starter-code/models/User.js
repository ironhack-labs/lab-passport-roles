const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bossSchema = new Schema(
    {
        username:String,
        password:String,

    },
    {
        timestamps:{
            createdAt:"created_at",
            updatedAt:"updated_at"
        }
    }
    );

module.exports = mongoose.model("Boss", userSchema);s