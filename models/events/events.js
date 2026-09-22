const mongoose = require("mongoose");
const plainEventTitle = require('../../utils/plainEventTitle');

const eventsSchema = new mongoose.Schema({
    title: { type: String, set: plainEventTitle },
    description: String,
    startDate: Date,
    endDate: Date,
    venue: String,
    category: String,
    tags: [String],
    image: [{
        type: String
    }],
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], default: "Upcoming" },
    registrationFee: String,
    isActive: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    registrationLink: String,

});
module.exports = new mongoose.model("Event", eventsSchema);
