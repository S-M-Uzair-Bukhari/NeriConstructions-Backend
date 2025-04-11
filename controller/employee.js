const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validation = require("../functions/validate");
const employeeFunction = require("../functions/employee");
const funcOtp = require("../functions/otp");
const mailer = require("../helper/mailer");
const employeeModel = require("../models/employee");

const createEmployeeByAdmin = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const validate = await validation.employeeEmailValidate(req);
    // console.log("first :", validate);
    // return
    if (validate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        success: false,
        msg: "Email is Already Taken!",
      });
    } else {
      const employee = await employeeFunction.addAdminEmployee(req, session);

      res.status(200).json({
        success: true,
        msg: "Employee is Created!",
        data: {
          _id: employee._id,
          email: employee.email,
          phNumber: employee.phNumber,
          companyId: employee.companyId,
        },
      });

      await session.commitTransaction();
      session.endSession();
      return;
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Having Errors :", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors!",
      error: error.message,
    });
  }
};
const employeeSignup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validate = await validation.employeeEmailValidate(req);
    if (validate) {
      await session.abortTransaction();
      session.endSession();

      return res.status(200).json({
        success: false,
        msg: "Email is Already Taken!",
      });
    } else {
      //   const employee = await employeeFunction.addEmployee(req, session);

      const token = jwt.sign(
        {
          email: req.body.email,
          phNumber: req.body.phNumber,
          password: req.body.password,
          companyId: req.body.companyId,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1y" }
      );
      const email = req.body.email;
      const createOtp = await funcOtp.generateOtp(email);
      const userData = {
        email: req.body.email,
        Otp: createOtp.otp,
      };

      const send = await mailer.sendMail(userData);

      res.status(200).json({
        success: true,
        msg: "Otp sent  Successfully!",
        data: {
          email: req.body.email,
          phNumber: req.body.phNumber,
          companyId: req.body.companyId,
        },
        accessToken: token,
      });
      await session.commitTransaction();
      session.endSession();
      return;
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("Having Errors :", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

const employeeLogin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validate = await validation.employeeEmailValidate(req);
    if (!validate) {
      await session.abortTransaction();
      session.endSession();

      return res.status(200).json({
        success: false,
        msg: "No Account Found!",
      });
    } else {
      const employee = await employeeFunction.getEmployee(req);
      const employeeId = employee._id;
      const employeeWithId = await employeeFunction.employeeWithId(employeeId);
      const verify = await validation.verifyEmployeePass(
        req.body.password,
        employee.password
      );
      if (!verify) {
        session.abortTransaction();
        session.endSession();
        return res.status(200).json({
          success: false,
          msg: "Invalid Password!",
        });
      } else {
        const token = jwt.sign(
          {
            id: employee._id,
            email: employee.email,
            phNumber: employee.phNumber,
            companyId: employee.companyId,
            isVerified: employee.isVerified,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1y" }
        );

        res.status(200).json({
          success: true,
          msg: "Employee is Successfully loggedIn!",
          data:employeeWithId,
          accessToken: token,
        });
        await session.commitTransaction();
        session.endSession();
        return;
      }
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("Having Errors :", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors!",
      error: error.message,
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await employeeFunction.employeeProfile(req);
    return res.status(200).json({
      success: true,
      msg: "Employee Profile!",
      data: employee,
    });
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors!",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const employee = await employeeFunction.updateEmployee(req, session);

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      msg: "Employee is Updated Successfully!",
      data: employee,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Having Errors:", error);

    return res.status(403).json({
      success: false,
      msg: "Having Errors!",
      error: error.message,
    });
  }
};

const updateEmployeeLocation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const employee = await employeeFunction.updateEmployeeLocation(
      req,
      session
    );

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      msg: "Employee location is Updated Successfully!",
      data: employee,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Having Errors:", error);

    return res.status(403).json({
      success: false,
      msg: "Having Errors!",
      error: error.message,
    });
  }
};

const resetEmployeePassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validiate = await validation.employeeEmailValidate(req);

    if (validiate) {
      const { newPassword, email } = req.body;
      // console.log("object", email);
      const resetPassword = await employeeFunction.resetPassword(
        email,
        newPassword,
        session
      );
      if (resetPassword) {
        const userWithoutPassword = await employeeModel
          .findById(resetPassword._id)
          .select("-password")
          .lean();
        res.status(200).json({
          message: "updated sucessfully ",
          sucess: "true",
          data: userWithoutPassword,
        });
        await session.commitTransaction();
        session.endSession();
        return;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "unsucessfully not updated", sucess: "false" });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "kindly give valid email", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const setNewEmployeePassword = async (req, res) => {
  const session = await mongoose.startSession();
  let sessionEnded = false;

  session.startTransaction();

  try {
    const validiate = await validation.employeeEmailValidate(req);

    if (!validiate) {
      await session.abortTransaction();
      session.endSession();
      sessionEnded = true;
      return res.status(400).json({
        message: "kindly give valid email",
        sucess: "false",
      });
    }

    const getProfile = await employeeFunction.getEmployee(req);
    const { password, email, newPassword } = req.body;

    const match = await employeeFunction.comparePassword(
      password,
      getProfile.password
    );

    if (!match) {
      await session.abortTransaction();
      session.endSession();
      sessionEnded = true;
      return res
        .status(200)
        .json({ message: "incorrect password", sucess: false });
    }

    const resetPassword = await employeeFunction.resetPassword(
      email,
      newPassword,
      session
    );

    if (!resetPassword) {
      await session.abortTransaction();
      session.endSession();
      sessionEnded = true;
      return res.status(400).json({
        message: "unsuccessfully not updated",
        sucess: "false",
      });
    }

    const userWithoutPassword = await employeeModel
      .findById(resetPassword._id)
      .select("-password")
      .lean();

    await session.commitTransaction();
    session.endSession();
    sessionEnded = true;

    return res.status(200).json({
      message: "updated successfully",
      sucess: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    if (!sessionEnded) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (e) {
        console.error("Session cleanup error:", e);
      }
    }

    return res.status(500).json({
      message: "something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

module.exports = {
  createEmployeeByAdmin,
  employeeSignup,
  employeeLogin,
  getEmployee,
  updateEmployee,
  resetEmployeePassword,
  setNewEmployeePassword,
  updateEmployeeLocation,
};
