const ExcelJS = require('exceljs');
const StudentAchievement = require("../models/achivement/studentAchievement");
const FacultyAchievement = require("../models/achivement/facultyAchievement");

const columnsFor = type => [type === 'faculty' ? 'faculty_name' : 'student_or_batch', 'award_or_title', 'year', 'description', 'category', 'status', 'institution'];
const badRequest = message => Object.assign(new Error(message), { status: 400 });
function value(cell) {
  if (cell.value == null) return '';
  if (typeof cell.value === 'object') {
    if (cell.value.richText) return cell.value.richText.map(part => part.text).join('').trim();
    throw new Error(`Cell ${cell.address}: use plain values, not formulas or dates`);
  }
  return String(cell.value).trim();
}

async function createTemplate(type = 'student') {
  if (!['student', 'faculty'].includes(type)) throw badRequest('Invalid achievement type');
  const columns = columnsFor(type);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(type === 'faculty' ? 'Faculty Achievements' : 'Student Achievements');
  sheet.columns = columns.map(key => ({ header: key, key, width: 28 }));
  sheet.getRow(1).font = { bold: true };
  return workbook.xlsx.writeBuffer();
}

async function importAchievements(buffer, type = 'student', Model = type === 'faculty' ? FacultyAchievement : StudentAchievement) {
  if (!['student', 'faculty'].includes(type)) throw badRequest('Invalid achievement type');
  const workbook = new ExcelJS.Workbook();
  try { await workbook.xlsx.load(buffer); } catch { throw badRequest('Provide a valid .xlsx workbook'); }
  const sheet = workbook.worksheets[0];
  if (!sheet) throw badRequest('Workbook has no worksheets');
  const columns = columnsFor(type);
  const headers = new Map();
  try {
    sheet.getRow(1).eachCell((cell, index) => {
      const name = value(cell);
      if (!columns.includes(name)) throw new Error(`Unknown column: ${name}`);
      if (headers.has(name)) throw new Error(`Duplicate column: ${name}`);
      headers.set(name, index);
    });
  } catch (error) { throw badRequest(error.message); }
  for (const required of columns.slice(0, 3)) {
    if (!headers.has(required)) throw badRequest(`Missing required column: ${required}`);
  }
  const rows = [];
  sheet.eachRow((row, number) => {
    if (number > 1 && row.values.some(v => v != null && String(v).trim() !== '')) rows.push(row);
  });
  if (!rows.length || rows.length > 500) throw badRequest('Upload between 1 and 500 achievement rows');
  const results = [];
  for (const row of rows) {
    const data = { type };
    try {
      for (const [name, index] of headers) {
        const text = value(row.getCell(index));
        if (text !== '') data[name] = text;
      }
      if (data.year && !/^\d{4}$/.test(data.year)) throw new Error('Year must be an integer from 1900 to 9999');
      const record = new Model(data);
      await record.validate();
      await record.save();
      results.push({ row: row.number, title: data.award_or_title, success: true, id: record._id });
    } catch (error) {
      // Validation details are actionable; database internals are not upload feedback.
      const message = error.name === 'ValidationError' || !error.name || error.name === 'Error'
        ? error.message : 'Unable to save this achievement';
      results.push({ row: row.number, title: data.award_or_title || '', success: false, error: message });
    }
  }
  const imported = results.filter(result => result.success).length;
  return { success: imported === rows.length, total: rows.length, imported, failed: rows.length - imported, results };
}

module.exports = { importAchievements, createTemplate };
