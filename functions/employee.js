const employeeModel = require("../models/employee");
const bcrypt = require("bcrypt");

const addAdminEmployee = async (req, session) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const newEmployee = new employeeModel(req.body);
  newEmployee.password = hash;
  const result = await newEmployee.save({ session });
  return result;
};

const addEmployee = async (decode, session) => {
  const hashPassword = await bcrypt.hash(decode.password, 10);
  const newEmployee = new employeeModel({
    email: decode.email,
    phNumber: decode.phNumber,
    password: hashPassword,
    companyId: decode.companyId,
  });

  const result = await newEmployee.save({ session });
  return result;
};

const updateToken = async (req, refreshToken, session) => {
  const update = await employeeModel.findOneAndUpdate(
    { email: req.body.email },
    { set$: { sessionKey: refreshToken } },
    { session, new: true }
  );
  return update;
};

const getEmployee = async (req) => {
  const employee = await employeeModel.findOne({ email: req.body.email });
  return employee;
};

const employeeProfile = async (req) => {
  const { employeeId } = req.query;
  const employee = await employeeModel
    .findById({ _id: employeeId })
    .select("-password");
  return employee;
};

const employeeWithId = async (employeeId) => {
  const employee = await employeeModel
    .findById({ _id: employeeId })
    .select("-password");
  return employee;
};

// const createEmployee = async (req, session) => {
//   const { employeeId } = req.body;
//   const updatedData = req.body;
//   const create = new  employeeModel(
//     { _id: employeeId },
//     { $set: { updatedData } },
//     { session, new: true }
//   );
//   return create;
// };

// const updateEmployee = async (req, session) => {
//   const { employeeId } = req.body;
//   const updatedData = req.body;
//   const update = await employeeModel.findByIdAndUpdate(
//     { _id: employeeId },
//     { $set: { updatedData } },
//     { session, new: true }
//   );
//   return update;
// };

const updateEmployee = async (req, res, session) => {
  const employeeId = req.body.employeeId;
  // console.log("employeeId:", employeeId);
  const updatedData = { ...req.body };
  // console.log(req.body);
  if (!employeeId) {
    throw { message: "employeeId is not found" };
  }

  if (req.file?.filename) {
    updatedData.profileImage = req.file.filename;
  }

  const updatedEmployee = await employeeModel
    .findByIdAndUpdate(
      employeeId,
      { $set: { ...updatedData, isVerified: true } },
      { new: true, session }
    )
    .select("-password");

  return updatedEmployee;
};

const updateEmployeeLocation = async (req, res, session) => {
  const employeeId = req.body.employeeId;

  if (!employeeId) {
    throw { message: "employeeId is not found" };
  }
  const { country, state, city, fullAddress, longitude, latitude } = req.body;
  const updatedEmployee = await employeeModel
    .findByIdAndUpdate(
      employeeId,
      {
        $set: {
          country: country,
          state: state,
          city: city,
          fullAddress: fullAddress,
          longitude: longitude,
          latitude: latitude,
        },
      },
      { new: true, session }
    )
    .select("-password");

  return updatedEmployee;
};

const comparePassword = async (password, hashPassword) => {
  const compare = await bcrypt.compare(password, hashPassword);
  return compare;
};

const resetPassword = async (email, newPassword, session) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await employeeModel.findOneAndUpdate(
    { email: email },
    {
      $set: { password: hashPassword },
    },
    { new: true, session }
  );
  return resetPassword;
};

const verifyEmployee = async (userId, session) => {
  const verify = await employeeModel.findOneAndUpdate(
    { _id: userId },
    { $set: { isVerified: true } },
    { new: true, session }
  );
  return verify;
};

module.exports = {
  addEmployee,
  addAdminEmployee,
  updateToken,
  getEmployee,
  employeeProfile,
  updateEmployee,
  comparePassword,
  resetPassword,
  verifyEmployee,
  updateEmployeeLocation,
  employeeWithId
};
