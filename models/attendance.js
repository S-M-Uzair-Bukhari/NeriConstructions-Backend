const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    taskId:{
      type: Schema.Types.ObjectId,
      ref: "task",
      required: true
    },
    date: {
      type: String,
    },
    timeIn: {
      type: String,
    },
    timeOut: {
      type: String,
    },
    image: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
      locationName:{
        type: String
      }
    },
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },
    locationName:{
      type: String
    },
    status: {
      type: String,
      enum: ["OnTime", "Late", "Absent"],
    },
    notes: {
      type: String,
    },
    break: {
      startTime: { type: String },
      endTime: { type: String },
      duration: { type: String },
    },
    shiftHours:{
      type:String
    },
    overTime:{
      type:String
    }
  },
  { timestamps: true }
);


attendanceSchema.index({ location: "2dsphere" });

const attendanceModel = mongoose.model("Attendance", attendanceSchema);
module.exports = attendanceModel;
