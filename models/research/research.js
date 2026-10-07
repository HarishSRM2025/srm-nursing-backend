const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    researcher_name: {
      type: String,
      default: "",
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
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: 9999,
      validate: Number.isInteger,
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
    document_title: {
      type: String,
      default: "RESEARCH PUBLICATIONS & CERTIFICATIONS",
    },
    sno: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Research", researchSchema, "publications");
