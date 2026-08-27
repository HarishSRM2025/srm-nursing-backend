const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "General Enquiry",
    },
    program: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      trim: true,
      default: "General",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      default: "General Contact Form",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "resolved"],
      default: "new",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
