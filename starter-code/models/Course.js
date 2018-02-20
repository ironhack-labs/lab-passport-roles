const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        topic: String,
        level: String,
        description:String,
        studante_enroll:[]
       

    },
    {
      timestamps:{
            createdAt:"created_at",
            updatedAt:"updated_at"
        }
    });

module.exports = mongoose.model("Course", courseSchema);