const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      default: "SRM TRICHY COLLEGE OF NURSING",
    },
    document_title: {
      type: String,
      default: "FACULTY PUBLICATIONS & CERTIFICATIONS",
    },
    faculty_name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    sno: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publication", publicationSchema);
