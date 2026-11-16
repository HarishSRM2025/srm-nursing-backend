const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // e.g. "B.Sc. Nursing"
  fullName: { type: String, required: true, trim: true }, // e.g. "Bachelor of Science in Nursing"
  badge: { type: String, default: 'Undergraduate', trim: true }, // e.g. "Undergraduate", "Postgraduate", "Diploma"
  duration: { type: String, default: '4 Years Programme', trim: true },
  desc: { type: String, required: true, trim: true },
  image: { type: String, default: '' }, // stored in uploads/
  criteria: [{ type: String }],
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);

