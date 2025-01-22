import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from 'dotenv'
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

export async function uploadToCloudinary(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return result;
}
// For using upload function in other files:
export const upload = multer({ storage });
