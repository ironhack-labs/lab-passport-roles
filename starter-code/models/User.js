const { model, Schema } = require("mongoose");
const PLM = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true
    },
    firstName: String,
    lastName: String,
    age: Number,
    role: {
      type: String,
      enum: ["BOSS", "DEVELOPER", "TA", "STUDENT"],
      default: "STUDENT"
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(PLM, { usernameField: "email" });

module.exports = model("User", userSchema);
