const mongoose = require("mongoose");

const facultyAchievementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["faculty"],
      default: "faculty",
      immutable: true,
      index: true,
    },
    student_or_batch: {
      type: String,
      required: true,
      trim: true,
    },
    award_or_title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: 9999,
      validate: Number.isInteger,
    },
    category: {
      type: String,
      enum: ["Academic", "Sports", "Cultural", "Research", "Community", "General"],
      default: "General",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    institution: {
      type: String,
      default: "SRM TRICHY COLLEGE OF NURSING",
    },
    sno: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("FacultyAchievement", facultyAchievementSchema, "faculty_achievements");
