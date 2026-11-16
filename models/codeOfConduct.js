const mongoose = require('mongoose');
const ids = ['general-rules', 'disciplinary-committee', 'students', 'dress', 'hostel', 'ragging', 'principal', 'faculty', 'support'];
const text = { type: String, required: true, trim: true };
const number = { type: Number, required: true, min: 1, validate: Number.isInteger };
const options = { _id: false, strict: 'throw' };
const point = new mongoose.Schema({ num: number, text }, options);
const rule = new mongoose.Schema({
  num: number, text, isCompound: Boolean,
  subClauses: { type: [text], default: undefined },
  subAppeals: { type: [text], default: undefined },
  punishments: { type: [point], default: undefined },
}, options);
const schema = new mongoose.Schema({
  id: { type: String, enum: ids, required: true, unique: true },
  title: text,
  institution: { type: String, default: '' },
  address: { type: String, default: '' },
  institutionHeader: { type: String, default: '' },
  intro: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  paragraphs: [text],
  table: [new mongoose.Schema({ sno: text, name: text, position: text }, options)],
  rules: [rule], boys: [point], girls: [point],
}, { timestamps: true, strict: 'throw' });

module.exports = mongoose.model('CodeOfConduct', schema);
module.exports.sectionIds = ids;
