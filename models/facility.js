const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
  tag: { type: String, required: true },
  icon: { type: String, default: 'FiMonitor' }, // name of react-icons/fi component
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, default: '' }, // filename stored in uploads/
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Facility', FacilitySchema);
