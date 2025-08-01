import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function to use in your controller
export const cloudinaryUpload = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
