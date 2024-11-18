import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp"; // Ensure sharp is installed
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const port = 3000;

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./public/images")); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Denoise route with sharp and multer
app.post("/denoise", upload.single("image"), async (req, res) => {
  try {
    // Ensure file is uploaded
    const image = req.file?.filename;
    if (!image) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const inputPath = req.file.path; // Path of the uploaded image
    const outputFilename = `denoised_${req.file.originalname}`;
    const outputPath = path.join(__dirname, "public/images", outputFilename);

    await sharp(inputPath).median(3).toFile(outputPath);

    fs.unlink(inputPath, (err) => {
      if (err) {
        console.error("Failed to delete original file:", err);
      }
    });

    // Delete the original uploaded file

  
    // Respond with the path of the processed file
    return res.json({
      message: "Image processed successfully",
      outputFile: `/images/${outputFilename}`,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return res.status(500).json({ error: "Failed to process image." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
