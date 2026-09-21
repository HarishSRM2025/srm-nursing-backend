const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true })

module.exports = mongoose.model('Statute', schema)
