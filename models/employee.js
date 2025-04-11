const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    // required: true,
  },
  email: {
    type: String,
    rquired: true,
  },
  phNumber: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  DOB: {
    type: String,
  },
  designation: {
    type: String,
    // required: true
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  fullAddress: {
    type: String,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  isVerified: {
    type: Boolean,
    default: "false",
  },
});

const employeeModel = mongoose.model("Employee", employeeSchema);
module.exports = employeeModel;
