const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    name: String,
    startingDate: String,
    endDate: String,
    level: String,
    avaliable: Boolean
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Course = mongoose.model("Courses", courseSchema);

module.exports = Course;
