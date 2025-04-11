const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const imageStorage = multer.diskStorage({
  destination: "./public/employeeImage",
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
});
const employeeController = require("../controller/employee");

router.post(
  "/employee/crateEmployee",
  employeeController.createEmployeeByAdmin
);
router.post("/employee/signup", employeeController.employeeSignup);
router.post("/employee/login", employeeController.employeeLogin);
router.post("/employee/updateEmployeeLocation", employeeController.updateEmployeeLocation);
router.get("/employee/getEmployee", employeeController.getEmployee);
router.post(
  "/employee/editEmployee",
  imageUpload.single("profileImage"),
  employeeController.updateEmployee
);
router.post("/employee/resetPassword", employeeController.resetEmployeePassword);
router.post("/employee/setNewPassword", employeeController.setNewEmployeePassword);

module.exports = router;
