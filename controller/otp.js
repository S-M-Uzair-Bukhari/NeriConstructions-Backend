const { default: mongoose } = require("mongoose");
const func = require("../functions/otp");
const jwt = require("jsonwebtoken");
const employeeFunc = require("../functions/employee");
const validation = require("../functions/validate");
const mailer = require("../helper/mailer");

const verifyOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const verify = await func.verifyOtp(req, session);
    if (verify) {
      const { addEmployeeToken } = req.body;
      const decode = jwt.verify(addEmployeeToken, process.env.SECRET_KEY);
      const employee = await employeeFunc.addEmployee(decode, session);
      const token = jwt.sign(
        {
          id: employee._id,
          email: employee.email,
          phNumber: employee.phNumber,
          companyId: employee.companyId,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1y" }
      );

      res.status(200).json({
        message: "sucessfully verify",
        success: true,
        data: {
          id: employee._id,
          email: employee.email,
          phNumber: employee.phNumber,
          companyId: employee.companyId,
        },
        accessToken: token,
      });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      res.status(200).json({ message: "invalid Otp", success: false });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error :", error);
    res.status(400).json({
      message: "somrthing went wrong",
      success: false,
      error: error.message,
    });
  }
};

const verify = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const verify = await func.verifyOtp(req, session);
    if (verify) {
      res.status(200).json({
        message: "sucessfully verify",
        success: true,
        data: verify,
      });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      res.status(200).json({ message: "invalid Otp", success: false });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error :", error);
    res.status(400).json({
      message: "somrthing went wrong",
      success: false,
      error: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const resendOtp = await func.resendOtp(req);
    if (!resendOtp) {
      const email = req.body.email;
      const gen = await func.generateOtp(email);
      const userData = {
        email: req.body.email,
        Otp: gen.otp,
      };
      const send = await mailer.sendMail(userData);
      res
        .status(200)
        .json({ message: "sucessfully sent", success: true, data: userData });
      await session.commitTransaction();
      session.endSession();
    } else {
      await session.abortTransaction();
      session.endSession();
      res.status(200).json({ message: "already sent", success: false });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({
      message: "somrthing went wrong",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  verifyOtp,
  resendOtp,
  verify
};
