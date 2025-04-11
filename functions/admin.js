const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");

const signUp = async (req, session) => {
    const newAdmin = new adminModel(req.body);
    const hash = await bcrypt.hash(req.body.password, 10);
    newAdmin.password = hash;
    const result = await newAdmin.save({ session });
    return result 
};

const udpateToken = async (req, refreshToken, session) => {
    const update = await adminModel.findOneAndUpdate({email: req.body.email},
        {$set: {sessionKey: refreshToken}},
        { session, new: true },
    );
    return update
};

const getAdmin = async (req) => {
    let { email } = req.body;
    const admin = await adminModel.findOne({email: email});
    return admin;
}

const getAdminProfile = async (req) => {
    let adminId = req.admin.id;
    const admin = await adminModel.findById(adminId);
    return admin
};

const updateAdmin = async (req) => {

};

module.exports = {
    signUp,
    udpateToken,
    getAdmin,
    updateAdmin
};