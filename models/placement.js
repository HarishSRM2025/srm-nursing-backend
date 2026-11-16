const mongoose = require('mongoose');

const requiredText = { type: String, required: true, trim: true };
const embedded = (fields) => new mongoose.Schema(fields, { _id: false });
const schema = new mongoose.Schema({
  key: { type: String, default: 'placements', enum: ['placements'], unique: true },
  batches: [embedded({
    year: requiredText,
    total: requiredText,
    hospitals: [embedded({
      name: requiredText,
      count: { type: Number, required: true, min: 0, validate: Number.isInteger },
    })],
  })],
  internationalPlacements: [embedded({
    initials: requiredText, name: requiredText, role: requiredText,
    hospital: requiredText, location: requiredText, country: requiredText,
    flag: String, program: requiredText,
  })],
  destinations: [embedded({ label: requiredText, count: requiredText })],
  partners: [embedded({ name: requiredText, location: requiredText })],
  stats: [embedded({
    icon: { type: String, enum: ['FiUsers', 'FiHome', 'FiGlobe', 'FiTrendingUp'], required: true },
    number: requiredText, suffix: { type: String, default: '' }, label: requiredText,
  })],
}, { timestamps: true });

module.exports = mongoose.model('Placement', schema);
