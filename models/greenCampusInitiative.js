const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'FaCheckCircle',
      trim: true,
    },
  },
  { _id: false }
);

const metricSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      default: '',
      trim: true,
    },
    label: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const greenCampusInitiativeSchema = new mongoose.Schema(
  {
    initiativeId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    number: {
      type: String,
      trim: true,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'FaLeaf',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    imageAlt: {
      type: String,
      default: '',
      trim: true,
    },
    text: {
      type: String,
      default: '',
      trim: true,
    },
    points: {
      type: [pointSchema],
      default: [],
    },
    metric: {
      type: metricSchema,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GreenCampusInitiative', greenCampusInitiativeSchema);

