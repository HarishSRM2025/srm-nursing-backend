const mongoose = require("mongoose");
const createSchema = require("./achievementSchema");

// Keep existing records accessible in the established collection.
module.exports = mongoose.model("FacultyAchievement", createSchema("faculty"), "achievements");
