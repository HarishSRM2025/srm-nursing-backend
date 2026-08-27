const mongoose = require("mongoose");

const LeadershipSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Designation:{
        type:String,
        required:true
    },
    Degree:{
        type:String
    },
    ProfileImage:{
        type:String,
        required:true
    },
    Message:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    order:{
        type:Number,
        default:0,
        required:true
    }
    
})

module.exports = mongoose.model("LeaderShip", LeadershipSchema);
