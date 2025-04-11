const adminModel = require("../models/admin");
const employeeModel = require("../models/employee");
const bcrypt = require("bcrypt");

const adminEmailValidate = async (req) => {
    // console.log({email: req.body.email});
    const { email } = req.body;
    console.log("email :",email);
    let existing = await adminModel.findOne({email: email});
    if(existing){
        return true
    } else {
        return false
    }
};

const employeeEmailValidate = async (req) => {
    const { email } = req.body;
    console.log("email:", email);
    let existing = await employeeModel.findOne({email: email})
    if(existing){
        return true
    } else {
        return false
    }
};

const verifyAdminPass = async (password, hash) => {
    let match = await bcrypt.compare(password, hash);
    console.log("testing :", match);
    return match
};

const verifyEmployeePass = async (password, hash) => {
    let match = await bcrypt.compare(password, hash)
    console.log("testing :", match);
    return match
};


module.exports = { 
    adminEmailValidate,
    employeeEmailValidate,
    verifyAdminPass,
    verifyEmployeePass
}