const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    sessionKey: {
        type: String
    },
});

const admninModel = mongoose.model("Admin", adminSchema);
module.exports = admninModel;
