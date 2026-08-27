const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model("Achievement", achievementSchema);
