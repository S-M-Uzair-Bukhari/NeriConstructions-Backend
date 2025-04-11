const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const imageStorage = multer.diskStorage({
  destination: "./public/image",
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
});
const attendaceController = require("../controller/attendance");
const { generateAttendencePdf } = require("../functions/attendance");

router.post(
  "/attendance/timeIn",
  imageUpload.single("image"),
  attendaceController.timeIn
);
router.post("/attendance/timeOut", attendaceController.timeOut);
router.post("/attendance/break", attendaceController.updateBreakTime);
router.get("/attendance/today", attendaceController.todayAttendance);
router.get("/attendance/weekly", attendaceController.weeklyAttendance);
router.get("/attendance/monthly", attendaceController.monthlyAttendance);
router.get("/attendance/pdf",generateAttendencePdf)

module.exports = router;
