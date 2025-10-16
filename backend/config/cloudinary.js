import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.dwqs4djmz,
  api_key: process.env.428712313866816,
  api_secret: process.env.ZtLQGTDw-opS-CKjxhatPsyfVHI,
});

export default cloudinary;
