const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin");

router.post("/admin/Signup", adminController.signup);
router.post("/admin/login", adminController.login);
router.get("/admin/getAdmin", adminController.getAdmin);
router.post("/admin/updateAdmin", adminController.updateAdmin);

module.exports = router;