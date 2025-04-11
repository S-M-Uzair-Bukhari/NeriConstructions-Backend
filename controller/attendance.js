const mongoose = require("mongoose");
require("dotenv").config();
const attendanceFunction = require("../functions/attendance");
const taskfunction = require("../functions/task");

const timeIn = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const nearBy = await taskfunction.findLocation(req);
    console.log("Is Employee Near:", nearBy);
    if(!nearBy){
        res.status(200).json({
          success: false,
          msg: "You're not at Location!"
        })
        await session.abortTransaction();
        session.endSession();
        return
    } else {
      const timeIn = await attendanceFunction.markAttendance(req, session);
      res.status(200).json({
        success: true,
        msg: "Attendance is Marked!",
        data: timeIn,
      });
      await session.commitTransaction();
      session.endSession();
      return;
    }
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("having Errors", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

const timeOut = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const attendance = await attendanceFunction.markTimeOut(req, session);
    res.status(200).json({
      success: true,
      msg: "Time Out Marked Successfully!",
      data: attendance,
    });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("having Errors", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

const todayAttendance = async (req, res) => {
  try {
    const attendance = await attendanceFunction.getTodayAttendance(req);
    // console.log("today Attendance :", attendance);
    if (!attendance) {
      return res.status(400).json({
        success: true,
        msg: "attendence not found",
        data: attendance,
      });
    } else {
      return res.status(200).json({
        success: true,
        msg: "Today's Attendance!",
        data: attendance,
      });
    }
  } catch (error) {
    console.log("having Errors", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

const weeklyAttendance = async (req, res) => {
  try {
    const attendance = await attendanceFunction.getWeeklyAttendance(req);
    console.log("weekly Attendance :", attendance);
    if (!attendance) {
      return res.status(400).json({
        success: true,
        msg: "weekly attendence not found",
        data: attendance,
      });
    } else {
      return res.status(200).json({
        success: true,
        msg: "Weekly Attendance!",
        data: attendance,
      });
    }
  } catch (error) {
    console.log("having Errors", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

const monthlyAttendance = async (req, res) => {
  try {
    const attendance = await attendanceFunction.getMonthlyAttendace(req);
    return res.status(200).json({
      success: true,
      msg: "Monthy Attendance!",
      data: attendance,
    });
  } catch (error) {
    console.log("having Errors", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

const updateBreakTime = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const takeBreak = await attendanceFunction.updateBreakTime(req, session);
    if (takeBreak) {
      res
        .status(200)
        .json({
          message: "sucessfully updated",
          success: true,
          data: takeBreak,
        });
      await session.commitTransaction();
      session.endSession();
    } else {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: "Break update failed", success: false });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("having Errors", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

module.exports = {
  timeIn,
  timeOut,
  todayAttendance,
  weeklyAttendance,
  monthlyAttendance,
  updateBreakTime,
};
