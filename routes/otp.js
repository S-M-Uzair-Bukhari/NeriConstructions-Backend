const express = require("express");
const { verifyOtp, resendOtp, verify } = require("../controller/otp");
const router = express.Router();

router.post("/otp/verifyOtp", verifyOtp);
router.post("/otp/resendOtp", resendOtp);
router.post("/otp/verify", verify);

module.exports = router;
