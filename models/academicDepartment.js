const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "FaCheckCircle",
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const academicDepartmentSchema = new mongoose.Schema(
  {
    deptId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
      default: "",
    },
    eyebrow: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      default: "#4b2e83",
      trim: true,
    },
    icon: {
      type: String,
      default: "FaHeartbeat",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    imageAlt: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [highlightSchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicDepartment", academicDepartmentSchema);

