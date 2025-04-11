const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/taskFiles");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", // JPEG images
    "image/png", // PNG images
    "image/gif", // GIF images
    "image/jpg", // JPG images
    "application/pdf", // PDF files
    "image/webp", // WEBP images
    "application/msword", // Word documents
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.ms-excel", // Excel .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  // Excel .xlsx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files (jpg, jpeg, png, gif, webp), pdf, excel, and word files are allowed!"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
});

module.exports = upload;
