const { model, Schema } = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new Schema(
	{
		username: String,
		password: String,
		slackID: String,
		role: {
			type: String,
			enum: ["BOSS", "DEVELOPER", "TA", "STUDENT"],
			default: "STUDENT"
		},
		firstName: String,
		lastName: String,
		email: String
	},
	{
		versionKey: false,
		timestamps: true
	}
);

userSchema.plugin(plm, { usernameFiled: "username" });

module.exports = model("User", userSchema);
