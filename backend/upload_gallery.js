const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const galleryDir = path.join(__dirname, '../client/public/images/gallery');

async function uploadImages() {
  const files = fs.readdirSync(galleryDir);
  const imageUrls = [];

  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
      const filePath = path.join(galleryDir, file);
      console.log(`Uploading ${file}...`);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'eventum_gallery',
          use_filename: true,
          unique_filename: false,
        });
        imageUrls.push(result.secure_url);
        console.log(`Uploaded ${file}: ${result.secure_url}`);
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err);
      }
    }
  }

  console.log('\n--- URLs ---');
  console.log(JSON.stringify(imageUrls, null, 2));
}

uploadImages();
