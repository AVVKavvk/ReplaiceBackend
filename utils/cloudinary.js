const cloudinary = require('cloudinary').v2;

cloudinary.config({
  api_key: process.env.Cloudinary_API_Key,
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_secret: process.env.Cloudinary_API_Secret
});

module.exports = {cloudinary};
