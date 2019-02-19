// config/ cloudinary.js
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.cloudKey,
  api_secret: process.env.cloudSecret
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'rooms-gallery', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  }
});
const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;