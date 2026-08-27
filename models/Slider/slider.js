const mongoose = require("mongoose")

const SliderSchema = new mongoose.Schema({
    Image:{
        type:String,
        required:true
    },
    Title:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Tag:{
        type:String,
        required:true
    },
    Order:{
        type:Number,
        required:true
    },
    Status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }
    
})

module.exports = mongoose.model("Slider", SliderSchema);