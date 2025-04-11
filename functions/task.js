const moment = require("moment");
const { default: mongoose } = require("mongoose");
const taskModel = require("../models/task");
const PDFDocument = require("pdfkit");

const findLocation = async (req) => {
  const { taskId, latitude, longitude} = req.body;
  
  const task = await taskModel.findOne({
    _id: taskId,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: 1000
      }
    }
  });  
  if(task){
    return true
  } else {
    return false
  }

};

const createTask = async (req, session) => {
  const {
    asignedBy,
    asignedTo,
    taskTitle,
    description,
    priority,
    difficulty,
    duration,
    date,
    latitude,
    longitude,
    locationName
  } = req.body;

  const location = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
    locationName: locationName
  };

  console.log("first", location);
  // return 


  const formattedDate = date
    ? moment(date, "DD-MM-YYYY").format("DD-MM-YYYY")
    : moment().format("DD-MM-YYYY");

  const pdfFile = req.file ? req.file.filename : null;

  const create = new taskModel({
    asignedBy,
    asignedTo,
    taskTitle,
    description,
    priority,
    difficulty,
    duration,
    date: formattedDate,
    pdfFile,
    location,
    latitude,
    longitude
  });

  const result = await create.save({ session });
  return result;
};

const updateTask = async (id, userData, session, file) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid task ID");
  }
  if (file) {
    userData.pdfFile = file.filename;
  }

  const task = await taskModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true, session }
  );

  return task;
};

const deleteTask = async (id, session) => {
  const task = await taskModel.findByIdAndDelete(id, { new: true, session });
  return task;
};

const getTask = async (id) => {
  const task = await taskModel.findById(id).populate("comments.employeeId", "firstName lastName designation profileImage");
  return task;
};

const getAllTaskByAdmin = async (adminId) => {
  const task = await taskModel.find({ asignedBy: adminId });
  return task;
};

const getAllTaskByEmployee = async (employeeId) => {
  const task = await taskModel.find({ asignedTo: employeeId });
  return task;
};

const updateTaskStatus = async (id, status, session) => {
  const result = await taskModel.findByIdAndUpdate(
    id,
    { status: status },
    { new: true, session }
  );
  return result;
};

const getTodayTask = async (req) => {
  const { employeeId } = req.query;
  const todayDate = moment().format("DD-MM-YYYY");

  const task = await taskModel.find({
    asignedTo: new mongoose.Types.ObjectId(employeeId),
    date: todayDate,
  });

  return task;
};

const getWeeklyTask = async (req) => {
  const { employeeId } = req.query;

  const objectId = new mongoose.Types.ObjectId(employeeId);

  const startOfWeek = moment().startOf("isoWeek");
  const endOfWeek = moment().endOf("isoWeek");

  const dateRange = [];
  const current = moment(startOfWeek);

  while (current.isSameOrBefore(endOfWeek)) {
    dateRange.push(current.format("DD-MM-YYYY"));
    current.add(1, "day");
  }

  const task = await taskModel.find({
    asignedTo: objectId,
    date: { $in: dateRange },
  });

  return task;
};

const getMonthlyTask = async (req) => {
  const { employeeId, year, month } = req.query;

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10); // Month 1-12

  if (isNaN(yearNum) || isNaN(monthNum)) {
    throw new Error("Invalid year or month.");
  }

  const dateList = [];
  const current = moment(`${yearNum}-${monthNum}`, "YYYY-M").startOf("month");
  const end = moment(current).endOf("month");

  while (current.isSameOrBefore(end)) {
    dateList.push(current.format("DD-MM-YYYY"));
    current.add(1, "day");
  }

  const task = await taskModel.find({
    asignedTo: new mongoose.Types.ObjectId(employeeId),
    date: { $in: dateList },
  });

  return task;
};

const getYearlyTask = async (req) => {
  const { employeeId, year } = req.query;

  if (!employeeId || !year) {
    throw new Error("employeeId and year are required");
  }

  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) throw new Error("Invalid year format");

  const start = moment(`${yearNum}-01-01`, "YYYY-MM-DD");
  const end = moment(start).endOf("year");

  const dateList = [];
  const current = moment(start);

  while (current.isSameOrBefore(end)) {
    dateList.push(current.format("DD-MM-YYYY"));
    current.add(1, "day");
  }

  const task = await taskModel.find({
    asignedTo: new mongoose.Types.ObjectId(employeeId),
    date: { $in: dateList },
  });

  return task;
};

const generatePdf = async (req, res) => {
  try {
    const { taskId } = req.query;
    const task = await taskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const doc = new PDFDocument();

    // Set up the response to stream the PDF to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=task-details.pdf"
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add title to PDF
    doc.fontSize(16).text("Task Details", { align: "center" });

    // Add task details to PDF
    doc.fontSize(12).text(`Task ID: ${task._id}`);
    doc.text(`Task Given By: ${task.taskGivenBy}`);
    doc.text(`Task Taken By: ${task.taskTakenBy}`);
    doc.text(`Task: ${task.task}`);
    doc.text(`Task Details: ${task.taskDetails}`);
    doc.text(`Priority: ${task.priority}`);
    doc.text(`Difficulty: ${task.difficulty}`);
    doc.text(`Duration: ${task.duration}`);
    doc.text(`Date: ${task.date}`);

    // End the document
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

const addComments = async (req, session) => {
  const { taskId, employeeId, text} = req.body;

  const newComment = {
    employeeId: employeeId,
    text: text
  };

  const task = await taskModel.findByIdAndUpdate({_id: taskId},
    { $push: { comments: newComment}},
    { session, new: true});

    return task
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTaskByAdmin,
  getTask,
  getAllTaskByEmployee,
  updateTaskStatus,
  getTodayTask,
  getWeeklyTask,
  getMonthlyTask,
  getYearlyTask,
  generatePdf,
  findLocation,
  addComments
};
