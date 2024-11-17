// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// dotenv.config();
// const app = express();
// const __filename = fileURLToPath(import.meta.url);
//  const __dirname = path.dirname(__filename);
//  app.use(cors());
//  app.use(express.json());
//  app.use(express.urlencoded({ extended: true }));
//  app.use(express.static(path.join(__dirname, "public")));
// const port = 3000;
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "./public/images"));
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const upload = multer({ storage: storage });

// app.post("/denoise", upload.single("image"), (req, res) => {
//    const image = req.file?.filename;
//    if(!image){  
//     return res.status(400).json({ error: 'No file uploaded.' });
//   }
//   console.log(image);
//   return res.json({ image: 'Image uploaded sucessfuly' });

// });
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
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

    // Apply Gaussian blur using sharp
    await sharp(inputPath)
      .blur(5) // Adjust blur intensity here
      .toFile(outputPath);

    // Delete the original uploaded file
    fs.unlinkSync(inputPath);

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
