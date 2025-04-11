const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");
const employeeModel = require("../models/employee");
require("dotenv").config();


const verifyAdmin = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ")[1];
        req.token = bearer;
        jwt.verify(bearer, process.env.SECRET_KEY, async (error, authData) =>{
            if(error){
                console.log("Invalid Token :", error);
                return res.status(403).json({msg: "Invalid Token"});
            } else {
                let id = authData._id;
                let adminData = await adminModel.findById(id).select("-password");
                req.admin = adminData;
                next();
            }
        })
    } else {
        return res.status(403).json({msg: "Token Not Found!"});
    }
};

module.exports = {
    verifyAdmin
}