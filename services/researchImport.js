const ExcelJS = require('exceljs');
const Research = require('../models/research/research');

const columns = ['title', 'year', 'researcher_name', 'description', 'status', 'institution', 'document_title'];
const badRequest = message => Object.assign(new Error(message), { status: 400 });
function value(cell) {
  if (cell.value == null) return '';
  if (typeof cell.value === 'object') {
    if (cell.value.richText) return cell.value.richText.map(part => part.text).join('').trim();
    throw new Error(`Cell ${cell.address}: use plain values, not formulas or dates`);
  }
  return String(cell.value).trim();
}

async function createTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Research');
  sheet.columns = columns.map(key => ({ header: key, key, width: 28 }));
  sheet.getRow(1).font = { bold: true };
  return workbook.xlsx.writeBuffer();
}

async function importResearch(buffer, Model = Research) {
  const workbook = new ExcelJS.Workbook();
  try { await workbook.xlsx.load(buffer); } catch { throw badRequest('Provide a valid .xlsx workbook'); }
  const sheet = workbook.worksheets[0];
  if (!sheet) throw badRequest('Workbook has no worksheets');
  const headers = new Map();
  try {
    sheet.getRow(1).eachCell((cell, index) => {
      const name = value(cell);
      if (!columns.includes(name)) throw new Error(`Unknown column: ${name}`);
      if (headers.has(name)) throw new Error(`Duplicate column: ${name}`);
      headers.set(name, index);
    });
  } catch (error) { throw badRequest(error.message); }
  for (const required of columns.slice(0, 2)) {
    if (!headers.has(required)) throw badRequest(`Missing required column: ${required}`);
  }
  const rows = [];
  sheet.eachRow((row, number) => {
    if (number > 1 && row.values.some(v => v != null && String(v).trim() !== '')) rows.push(row);
  });
  if (!rows.length || rows.length > 500) throw badRequest('Upload between 1 and 500 research rows');
  const results = [];
  for (const row of rows) {
    const data = {};
    try {
      for (const [name, index] of headers) {
        const text = value(row.getCell(index));
        if (text !== '') data[name] = text;
      }
      if (data.year && !/^\d{4}$/.test(data.year)) throw new Error('Year must be an integer from 1900 to 9999');
      const record = new Model(data);
      await record.validate();
      await record.save();
      results.push({ row: row.number, title: data.title, success: true, id: record._id });
    } catch (error) {
      // Validation details are actionable; database internals are not upload feedback.
      const message = error.name === 'ValidationError' || !error.name || error.name === 'Error'
        ? error.message : 'Unable to save this research record';
      results.push({ row: row.number, title: data.title || '', success: false, error: message });
    }
  }
  const imported = results.filter(result => result.success).length;
  return { success: imported === rows.length, total: rows.length, imported, failed: rows.length - imported, results };
}

module.exports = { importResearch, createTemplate };
