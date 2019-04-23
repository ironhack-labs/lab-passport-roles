const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const coursesSchema = new mongoose.Schema(
  {
    name: String,
    schedule: {
      type: String,
      enum: ["PART-TIME", "FULL-TIME"]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

coursesSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("courses", coursesSchema);
