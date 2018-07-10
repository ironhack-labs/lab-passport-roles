const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema ({
    title:String,
    plot: String,
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updated_at",
    }
})

module.exports= mongoose.model("Course", courseSchema);