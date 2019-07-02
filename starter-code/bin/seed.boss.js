require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const testBoss = {
	username: process.env.TEST_BOSS_USERNAME,
	password: process.env.TEST_BOSS_PASSWORD,
	role: "BOSS",
	firstName: process.env.TEST_BOSS_FIRSTNAME,
	lastName: process.env.TEST_BOSS_LASTNAME,
	email: process.env.TEST_BOSS_EMAIL
};

mongoose
	.connect(process.env.DB, { useCreateIndex: true, useNewUrlParser: true })
	.then(x => {
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
		createTestBoss();
	})
	.catch(err => {
		console.error("Error connecting to mongo", err);
	});

async function createTestBoss() {
	try {
		const result = await User.register(new User({ username: testBoss.username, role: testBoss.role, firstName: testBoss.firstName, lastName: testBoss.lastName, email: testBoss.email }), testBoss.password);
		console.log("Test BOSS create: ", result);
	} catch (err) {
		console.log("Error creating Test BOSS: ", err);
	} finally {
		mongoose.connection.close();
	}
}
