const siteController = require("./siteController");
const authController = require("./authController");
const privateController = require("./privateController");
const courseController= require("./courseController");
module.exports = (app) => {
  app.use("/", siteController);
  app.use("/auth", authController);
  app.use("/private", privateController);
  app.use("/course", courseController);
};
