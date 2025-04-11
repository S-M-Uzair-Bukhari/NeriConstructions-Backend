const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminFunction = require("../functions/admin");
const validation = require("../functions/validate");


const signup = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const validate = await validation.adminEmailValidate(req);
        if(validate){
            await session.abortTransaction();
            session.endSession();

            return res.status(200).json({
                success: false,
            })
        } else {
            const admin = await adminFunction.signUp(req, session);

            let refreshToken = jwt.sign({
                id: admin._id,
                email: admin.email,
                msg: "Email is Already Taken!"
            }, process.env.SECRET_KEY, {expiresIn: "1y"});

            await adminFunction.udpateToken(req, refreshToken, session);

            let token = jwt.sign({
                id: admin._id,
                email: admin.email,
            }, process.env.SECRET_KEY, {expiresIn: "1y"});

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                msg: "Admin Signned up Successfully!",
                data: admin,
                accessToken: token, refreshToken
            });
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.log("Having Errors: ", error);
        return res.status(503).json({
            success: false,
            msg: "Having Errors",
            error: error.message
        })      
    }
};

const login = async (req, res) => {
    try {
        const validate = await validation.adminEmailValidate(req);
        if(!validate){
            return res.status(200).json({
                success: false,
                msg: "No Email Found!"
            })
        } else {
            const admin = await adminFunction.getAdmin(req);
            let password = req.body.password;
            let hash = admin.password;
            const verify = await validation.verifyAdminPass(password, hash);
            if(!verify){
                return res.status(200).json({
                    success: false,
                    msg: "Incorrect Password!"
                });
            } else {
                let refreshToken = jwt.sign({
                    id: admin._id,
                    email: admin.email
                }, process.env.SECRET_KEY, {expiresIn: "1y"})

                let token = jwt.sign({
                    id: admin._id,
                    email: admin.email
                }, process.env.SECRET_KEY, {expiresIn: "1y"})

                return res.status(200).json({
                    success: true,
                    msg: "Admin Logged In!",
                    data: {
                        _id: admin._id,
                        email: admin.email,
                    }, 
                    accessToken: token, refreshToken
                })
            }
        }    
    } catch (error) {
        console.log("Having Errors: ", error);
        return res.status(503).json({
            success: false,
            msg: "Having Errors",
            error: error.message
        })      
    }
};

const getAdmin = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("Having Errors: ", error);
        return res.status(503).json({
            success: false,
            msg: "Having Errors",
            error: message.error
        })      
    }
};

const updateAdmin = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("Having Errors: ", error);
        return res.status(503).json({
            success: false,
            msg: "Having Errors",
            error: message.error
        })      
    }
};

module.exports = {
    signup,
    login,
    getAdmin,
    updateAdmin
}