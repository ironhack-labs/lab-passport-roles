const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    name: String,
    startingDate: String,
    endDate: String,
    level: String,
    available: Boolean,
    owner: Schema.Types.ObjectId
  }
);

module.exports = mongoose.model("Course", courseSchema);