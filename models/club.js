const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: '',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
      default: '',
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['academic', 'cultural', 'welfare', 'committee', 'social', 'other'],
      default: 'other',
    },
    icon: {
      type: String,
      trim: true,
      default: 'stethoscope',
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    aim: {
      type: String,
      trim: true,
      default: '',
    },
    objectives: {
      type: [String],
      default: [],
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

module.exports = mongoose.model('Club', ClubSchema);

