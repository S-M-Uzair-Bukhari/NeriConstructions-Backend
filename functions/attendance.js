const moment = require("moment");
const attendanceModel = require("../models/attendance");
const { Types, default: mongoose } = require("mongoose");
const PDFDocument = require("pdfkit");


const markAttendance = async (req, session) => {
  const { employeeId, taskId, date, timeIn, notes, latitude, longitude, locationName } = req.body;
  
  // console.log("Location :", locationName);
  // return
  const formattedDate = date
    ? moment(date, "DD-MM-YYYY").format("DD-MM-YYYY")
    : moment().format("DD-MM-YYYY");

  const [time, period] = timeIn.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let formattedHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
  formattedHours = period === "AM" && hours === 12 ? 0 : formattedHours;

  const lateTime = new Date();
  lateTime.setHours(3, 50, 0, 0);

  const timeInDate = new Date();
  timeInDate.setHours(formattedHours, minutes, 0, 0);

  const status = timeInDate > lateTime ? "Late" : "OnTime";
  req.body.location = {
    type: "Point",
    coordinates: [
      parseFloat(req.body.longitude),
      parseFloat(req.body.latitude),
    ],
    locationName: locationName,
  };
  if (!req.file) {
    throw {
      status: 400,
      message: "File must be needed",
    };
  }

  const newAttendance = new attendanceModel({
    employeeId,
    taskId,
    date: formattedDate,
    timeIn,
    status,
    image: req.file.filename,
    location: req.body.location,
    longitude,
    latitude,
    locationName,
    notes,
  });

  const result = await newAttendance.save({ session });
  return result;
};

// const markAttendance = async (req, session) => {
//   const { employeeId, date, timeIn } = req.body;
//   const [time, period] = timeIn.split(" ");
//   const [hours, minutes] = time.split(":").map(Number);
//   let formattedHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
//   formattedHours = period === "AM" && hours === 12 ? 0 : formattedHours;

//   const lateTime = new Date();
//   lateTime.setHours(3, 50, 0, 0);

//   const timeInDate = new Date();
//   timeInDate.setHours(formattedHours, minutes, 0, 0);

//   const status = timeInDate > lateTime ? "Late" : "OnTime";

//   const newAttendance = new attendanceModel({
//     employeeId,
//     date,
//     timeIn,
//     status,
//   });

//   const result = await newAttendance.save({ session });
//   return result;
// };

const markTimeOut = async (req, session) => {
  const { attendanceId, timeOut, shiftHours, overTime } = req.body;
  const attendance = await attendanceModel.findByIdAndUpdate(
    { _id: attendanceId },
    { $set: { timeOut: timeOut, shiftHours: shiftHours, overTime: overTime } },
    { session, new: true }
  );
  return attendance;
};

// const markTimeOut = async (req, session) => {
//   const { employeeId, date, timeOut } = req.body;

//   const formattedDate = moment(date, "DD-MM-YYYY").format("DD-MM-YYYY");

//   const attendance = await attendanceModel.findOneAndUpdate(
//     { employeeId, date: formattedDate },
//     { $set: { timeOut: timeOut } },
//     { session, new: true }
//   );

//   return attendance;
// };

// const getTodayAttendance = async (req) => {
//   const { employeeId } = req.query;

//   const startOfDay = moment().startOf("day").toDate();
//   const endOfDay = moment().endOf("day").toDate();

//   const attendance = await attendanceModel.findOne({
//     employeeId,
//     date: { $gte: startOfDay, $lte: endOfDay },
//   });

//   console.log("today", attendance);
//   return attendance;
// };

const getTodayAttendance = async (req) => {
  const { employeeId } = req.query;
  // console.log(employeeId)
  const todayDate = moment().format("DD-MM-YYYY");
  // console.log(todayDate)
  const attendance = await attendanceModel.find({
    employeeId,
    date: todayDate,
  });
  //  console.log("today" ,attendance)
  return attendance;
};

// const getWeeklyAttendance = async (req) => {
//   const { employeeId } = req.query;

//   const objectId = new mongoose.Types.ObjectId(employeeId);

//   const startOfWeek = moment().startOf("isoWeek").startOf("day").toDate();
//   const endOfWeek = moment().endOf("isoWeek").endOf("day").toDate();

//   const attendance = await attendanceModel.find({
//     employeeId: objectId,
//     date: { $gte: startOfWeek, $lte: endOfWeek }, // Date comparison!
//   });

//   return attendance;
// };

const getWeeklyAttendance = async (req) => {
  const { employeeId } = req.query;

  const objectId = new mongoose.Types.ObjectId(employeeId);

  const startOfWeek = moment().startOf("isoWeek");
  const endOfWeek = moment().endOf("isoWeek");

  const dateRange = [];
  const current = moment(startOfWeek);

  while (current.isSameOrBefore(endOfWeek)) {
    dateRange.push(current.format("DD-MM-YYYY")); // Strictly formatted
    current.add(1, "day");
  }

  console.log("Generated date range:", dateRange);

  const attendance = await attendanceModel.find({
    employeeId: objectId,
    date: { $in: dateRange },
  });

  return attendance;
};

//  const getWeeklyAttendance = async (req) => {
//   const { employeeId } = req.query;

//   const objectId = new mongoose.Types.ObjectId(employeeId);

//   // Format week range as string
//   const startOfWeek = moment().startOf("isoWeek");
//   const endOfWeek = moment().endOf("isoWeek");

//   // Generate array of dates for the week as strings like "01-04-2025"
//   const dateRange = [];
//   const current = moment(startOfWeek);

//   while (current.isSameOrBefore(endOfWeek)) {
//     dateRange.push(current.format("DD-MM-YYYY"));
//     current.add(1, "day");
//   }

//   // Query for attendance with date IN the week
//   const attendance = await attendanceModel.find({
//     employeeId: objectId,
//     date: { $in: dateRange }, // use $in for string comparison
//   });
//   // console.log("Generated date range:", dateRange);

//   //   console.log("Weekly Attendance:", attendance);
//   return attendance;
// };

// const getWeeklyAttendance = async (req) => {
//   const { employeeId } = req.query;

//   const today = new Date();

//   const startOfWeek = new Date(today);
//   startOfWeek.setDate(today.getDate() - today.getDay() + 1);
//   startOfWeek.setHours(0, 0, 0, 0);
//   // console.log(employeeId)
//   //   console.log("startOfWeek" ,startOfWeek)
//   const endOfWeek = new Date(today);
//   endOfWeek.setDate(today.getDate() - today.getDay() + 7);
//   endOfWeek.setHours(23, 59, 59, 999);
//   //   console.log("Weekly range:", startOfWeek, "to", endOfWeek);
//   // console.log("endOfWeek" ,endOfWeek)
//   const objectId = new mongoose.Types.ObjectId(employeeId);
//   //   console.log("object:",objectId)
//   const attendace = await attendanceModel.find({
//     employeeId: objectId,
//     date: {
//       $gte: startOfWeek,
//       $lte: endOfWeek,
//     },
//   });
// console.log("object:",attendace)
//   return attendace;
// };

const getMonthlyAttendace = async (req) => {
  const { employeeId, year, month } = req.query;

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10); // Note: NOT -1, because moment uses 1-12

  if (isNaN(yearNum) || isNaN(monthNum)) {
    throw new Error("Invalid year or month.");
  }

  const dateList = [];
  const current = moment(`${yearNum}-${monthNum}`, "YYYY-M").startOf("month");
  const end = moment(current).endOf("month");

  while (current.isSameOrBefore(end)) {
    dateList.push(current.format("DD-MM-YYYY")); // format same as stored in DB
    current.add(1, "day");
  }

  const attendance = await attendanceModel.find({
    employeeId: new mongoose.Types.ObjectId(employeeId),
    date: { $in: dateList },
  });

  return attendance;
};

// const getMonthlyAttendace = async (req) => {
//   const { employeeId, year, month } = req.query;

//   const yearNum = parseInt(year, 10);
//   const monthNum = parseInt(month, 10) - 1;
//   if (isNaN(yearNum) || isNaN(monthNum)) {
//     console.log("Inavlid Numbers");
//   }

//   const startOfMonth = new Date(yearNum, monthNum, 1, 0, 0, 0, 0);
//   const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

//   const attendance = await attendanceModel.find({
//     employeeId: employeeId,
//     date: {
//       $gte: startOfMonth,
//       $lte: endOfMonth,
//     },
//   });

//   return attendance;
// };

const updateBreakTime = async (req, session) => {
  req.body.break = {
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    duration: req.body.duration,
  };
  const { id } = req.body;
  const breakTime = await attendanceModel.findByIdAndUpdate(
    id,
    { $set: { break: req.body.break } },
    { new: true, session }
  );
  return breakTime;
};


// const exportAttendanceToCsv = async (req, res) => {
//   try {
//     const { employeeId, year, month } = req.query;
//     if (!employeeId || !year || !month) {
//       return res
//         .status(400)
//         .json({ message: "fields required employeeId, year, and month" });
//     }
//     const yearNum = parseInt(year, 10);
//     const monthNum = parseInt(month, 10); // Note: NOT -1, because moment uses 1-12

//     if (isNaN(yearNum) || isNaN(monthNum)) {
//       res.status(400).json({ message: "Invalid year or month." });
//     }

//     const dateList = [];
//     const current = moment(`${yearNum}-${monthNum}`, "YYYY-M").startOf("month");
//     const end = moment(current).endOf("month");

//     while (current.isSameOrBefore(end)) {
//       dateList.push(current.format("DD-MM-YYYY")); // format same as stored in DB
//       current.add(1, "day");
//     }

//     // Fetch the attendance for the employee in the given month and year
//     const attendanceData = await attendanceModel.find({
//       employeeId: employeeId,
//       date: { $in: dateList },
//     });

//     // If no attendance data found
//     if (attendanceData.length === 0) {
//       return res.status(404).json({
//         message:
//           "No attendance records found for this employee in the specified period",
//       });
//     }

//     // Convert the attendance data to CSV
//     const json2csvParser = new Parser();
//     const csv = json2csvParser.parse(attendanceData);

//     // Set the response headers for file download
//     res.header("Content-Type", "text/csv");
//     res.attachment(`attendance_${employeeId}_${year}_${month}.csv`);

//     // Send the CSV as the response
//     res.send(csv);
//   } catch (error) {
//     console.error("Error exporting attendance to CSV:", error);
//     res.status(500).json({ message: "Error exporting attendance" });
//   }
// };

const generateAttendencePdf = async (req, res) => {
  try {
    const { employeeId, year, month, day } = req.query;

    // Ensure all required parameters are present
    if (!employeeId || !year || !month) {
      return res
        .status(400)
        .json({ message: "Please provide employeeId, year, and month." });
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10); // Month 1-12
    const dayNum = day ? parseInt(day, 10) : null;

    if (isNaN(yearNum) || isNaN(monthNum) || (day && isNaN(dayNum))) {
      throw new Error("Invalid year or month.");
    }

    const dateList = [];
    if (dayNum) {
      // Generate only one date if day is provided
      const specificDate = moment(`${yearNum}-${monthNum}-${dayNum}`, "YYYY-M-D");
      if (!specificDate.isValid()) {
        return res.status(400).json({ message: "Invalid date provided." });
      }
      dateList.push(specificDate.format("DD-MM-YYYY"));
    } else {
      // Full month logic
      const current = moment(`${yearNum}-${monthNum}`, "YYYY-M").startOf("month");
      const end = moment(current).endOf("month");

      while (current.isSameOrBefore(end)) {
        dateList.push(current.format("DD-MM-YYYY"));
        current.add(1, "day");
      }
    }

    // Fetch the attendance for the given employee within the given month and year
    const attendanceData = await attendanceModel.find({
      employeeId,
      date: {
        $in: dateList,
      },
    });

    // If no attendance records found
    if (attendanceData.length === 0) {
      return res.status(404).json({
        message: "No attendance records found for the specified period.",
      });
    }

    // Create a PDF document
    const doc = new PDFDocument();

    // Set up the response to stream the PDF to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance-report.pdf"
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add title to PDF
    doc.fontSize(16).text("Employee Attendance Report", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(14).text(`Employee ID: ${employeeId}`, 50, doc.y);
    doc.text(`Date: ${dateList[0]}`, 50, doc.y); // Assuming dateList[0] is the first date or specific day
    doc.moveDown(2);

    // Add Table Header
    const headerYPosition = doc.y;
    const columnWidths = [100, 110, 90, 100, 100];
    const columns = [ "Time In", "Duration", "Time Out", "Location", "Over-Time"];
    columns.forEach((column, index) => {
      doc
        .fontSize(12)
        .text(
          column,
          50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          headerYPosition,
          { width: columnWidths[index], align: "center" }
        );
    });
    doc.moveDown(1);

    // Draw a line under the headers
    doc
      .moveTo(50, headerYPosition + 20)
      .lineTo(550, headerYPosition + 20)
      .stroke();
    doc.moveDown(1);

    // Loop through the attendance data and add to the PDF
    attendanceData.forEach((attendance) => {
      const yPosition = doc.y;

     // Table columns
const columnWidths = [200, 120, 120, 120, 100];

doc.text(attendance.timeIn, 80, yPosition, columnWidths[0]); 
doc.text(attendance.shiftHours|| 'N/A', 150, yPosition, {
  width: columnWidths[1],
  align: "center",
});
doc.text(attendance.timeOut || 'N/A', 250, yPosition, {
  width: columnWidths[2],
  align: "center",
});
doc.text(attendance.location?.locationName || 'N/A', 350, yPosition, {
  width: columnWidths[3],
  align: "center",
  lineBreak: true
});
doc.text(attendance.overTime || 'N/A', 450, yPosition, {
  width: columnWidths[4],
  align: "center",
  
});

    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

module.exports = {
  markAttendance,
  markTimeOut,
  getTodayAttendance,
  getWeeklyAttendance,
  getMonthlyAttendace,
  updateBreakTime,
  generateAttendencePdf,
};
