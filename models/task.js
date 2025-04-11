const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    asignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    asignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    taskTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Finish"],
      default: "In Progress",
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Very Easy", "Easy", "Moderate", "Intermidiate", "Advanced"],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String, // Don't remove this field
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      },
      locationName:{
        type: String,
        required: true
      }
    },
    latitude:{
      type: String,
      required: true
    },
    longitude:{
      type: String,
      required: true
    },
    pdfFile: {
      type: String,
      default: null,
    },
    comments:[{
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      text: {
        type: String,
        required: true
      },
      createdAt:{
        type: Date,
        default: Date.now
      }
    }]
  },{ timestamps: true });

taskSchema.index({ location: '2dsphere' });

const taskModel = mongoose.model("task", taskSchema);

module.exports = taskModel;
