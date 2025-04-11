const func = require("../functions/task");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const task = await func.createTask(req, session);

    if (task) {
      res.status(200).json({ status: "sucess", sucess: "true", data: task });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "failed",
        message: "data isn't saved in Database",
        sucess: "false",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const userData = req.body;
    const task = await func.updateTask(id, userData, session,req.file);
    // console.log(profile)
    if (task) {
      res.status(200).json({ status: "sucess", sucess: "true", data: task });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "failed", message: "update failed", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { id } = req.body;
    const task = await func.deleteTask(id);
    if (task) {
      return res
        .status(200)
        .json({ message: "deleted sucessfully", sucess: "true", data: task });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "delete failed", sucess: "false" });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.query;
    const task = await func.getTask({ _id: id });
    // console.log("task :", task);
    // return
    if (task.length == 0) {
      return res
        .status(200)
        .json({ status: "task not found", sucess: "false" });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: task });
    }
  } catch (error) {
    console.log("having Errors :", error)
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};
const getAllTaskByAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;
    const task = await func.getAllTaskByAdmin(adminId);
    if (task.length == 0) {
      return res
        .status(200)
        .json({ status: "admin task not found", sucess: "false" });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: task });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const getAllTaskByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const task = await func.getAllTaskByEmployee(employeeId);
    if (task.length == 0) {
      return res
        .status(200)
        .json({ status: "employee task not found", sucess: "false" });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: task });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id, status } = req.body;
    const task = await func.updateTaskStatus(id, status, session);

    if (task) {
      res.status(200).json({ status: "sucess", sucess: "true", data: task });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "failed", message: "update failed", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const getTodayTask = async (req, res) => {
  try {
    const task = await func.getTodayTask(req);
    console.log("today task :", task);
    if (!task) {
      return res.status(400).json({
        success: true,
        msg: "task not found",
        data: task,
      });
    } else {
      return res.status(200).json({
        success: true,
        msg: "Today's task!",
        data: task,
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

const getWeeklyTask = async (req, res) => {
  try {
    const task = await func.getWeeklyTask(req);
    console.log("weekly task :", task);
    if (!task) {
      return res.status(400).json({
        success: true,
        msg: "weekly task not found",
        data: task,
      });
    } else {
      return res.status(200).json({
        success: true,
        msg: "Weekly task!",
        data: task,
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

const getMonthlyTask = async (req, res) => {
  try {
    const task = await func.getMonthlyTask(req);
    if (!task) {
      return res.status(400).json({
        success: true,
        msg: "monthly task not found",
        data: task,
      });
    } else {
    
      return res.status(200).json({
        success: true,
        msg: "Monthy task!",
        data: task,
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

const getYearlyTask = async (req, res) => {
  try {
    const task = await func.getYearlyTask(req)
    if (!task) {
      return res.status(400).json({
        success: true,
        msg: "yearly task not found",
        data: task,
      });
    } else {
      return res.status(200).json({
        success: true,
        msg: "Yearly task!",
        data: task,
      });
    }
  } catch (error) {
    console.log("Error in getYearlyTask:", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
};

const addComments = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const task = await func.addComments(req);
    res.status(200).json({
      success: true,
      message: "Comment Added Successfully!",
      data: task
    });
    await session.commitTransaction();
    session.endSession();
    return
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in getYearlyTask:", error);
    return res.status(403).json({
      success: false,
      msg: "Having Errors",
      error: error.message,
    });
  }
}



module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getAllTaskByAdmin,
  getAllTaskByEmployee,
  updateTaskStatus,
  getTodayTask,
  getWeeklyTask,
  getMonthlyTask,
  getYearlyTask,
  addComments
};
