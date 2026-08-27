const mongoose = require('mongoose')

const newsLetterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"]
    }
}, { timestamps: true })

module.exports = mongoose.model('newsLetter', newsLetterSchema)