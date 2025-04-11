const express = require("express");
const {
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
} = require("../controller/task");
const upload=require("../middleware/uploadPdf");
const { generatePdf } = require("../functions/task");
const router = express.Router();

router.post("/task/createTask",upload.single("pdfFile"), createTask);
router.post("/task/updateTask",upload.single("pdfFile"), updateTask);
router.post("/task/deleteTask", deleteTask);
router.post("/task/updateTaskStatus", updateTaskStatus);
router.get("/task/getTask", getTask);
router.get("/task/getAllTaskByAdmin", getAllTaskByAdmin);
router.get("/task/getAllTaskByEmployee", getAllTaskByEmployee);
router.get("/task/getTodayTask", getTodayTask);
router.get("/task/getWeeklyTask", getWeeklyTask);
router.get("/task/getMonthlyTask", getMonthlyTask);
router.get("/task/getYearlyTask", getYearlyTask);
router.post("/task/addComments", addComments);

router.get("/task/exportTaskPdf",generatePdf);

module.exports = router;
