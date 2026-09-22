const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const Events = require('../models/events/events');
const cleanTitle = require('../utils/plainEventTitle');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const normalize = value => cleanTitle(String(value || '')).normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const dateKey = value => {
    const date = new Date(value);
    return value && Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '';
};

async function main() {
    const file = process.argv[2];
    if (!file) throw new Error('Provide a workbook path');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file);
    const sheet = workbook.worksheets[0];
    const headers = {};
    sheet.getRow(1).eachCell((cell, index) => { headers[cell.text.trim()] = index; });
    if (!headers.title || !headers.category) throw new Error('title and category columns are required');
    await mongoose.connect(process.env.DBURL, { serverSelectionTimeoutMS: 10000 });
    const records = await Events.collection.find({}, { projection: { title: 1, category: 1, startDate: 1, eventId: 1 } }).toArray();
    const changes = [];
    const issues = [];
    const matched = new Map();
    let rows = 0;
    const titleRows = new Map();
    sheet.eachRow((row, number) => {
        if (number === 1) return;
        const key = normalize(row.getCell(headers.title).text);
        titleRows.set(key, (titleRows.get(key) || 0) + 1);
    });
    sheet.eachRow((row, number) => {
        if (number === 1 || !row.getCell(headers.title).text.trim()) return;
        rows++;
        const title = row.getCell(headers.title).text;
        const category = row.getCell(headers.category).text.trim();
        const startDate = headers.startDate ? dateKey(row.getCell(headers.startDate).value) : '';
        if (!category) { issues.push({ row: number, title, reason: 'Empty category' }); return; }
        let candidates = records.filter(record => normalize(record.title) === normalize(title));
        if (candidates.length > 1 && titleRows.get(normalize(title)) > 1 && startDate) candidates = candidates.filter(record => dateKey(record.startDate) === startDate);
        if (!candidates.length || (candidates.length > 1 && titleRows.get(normalize(title)) > 1)) { issues.push({ row: number, title, reason: candidates.length ? 'Ambiguous match' : 'No match' }); return; }
        for (const record of candidates) {
        const id = String(record._id);
        if (matched.has(id)) { issues.push({ row: number, title, reason: 'Multiple spreadsheet rows match the same record' }); return; }
        matched.set(id, category);
        if (record.category !== category) changes.push({ _id: record._id, title: record.title, oldCategory: record.category, newCategory: category });
        }
    });
    const unmatched = records.filter(record => !matched.has(String(record._id))).map(record => ({ id: String(record._id), title: record.title }));
    console.log(JSON.stringify({ spreadsheetRows: rows, databaseEvents: records.length, matched: matched.size, changes: changes.length, unchanged: matched.size - changes.length, issues, unmatchedDatabaseEvents: unmatched, categories: [...matched.values()].reduce((counts, category) => { counts[category] = (counts[category] || 0) + 1; return counts; }, {}) }, null, 2));
    if (!process.argv.includes('--apply')) return;
    if (issues.length) throw new Error('Resolve spreadsheet matching issues before applying');
    if (!changes.length) return;
    const backup = path.join(os.tmpdir(), `event-category-backup-${Date.now()}.json`);
    await fs.writeFile(backup, JSON.stringify(changes, null, 2), { flag: 'wx' });
    console.log(`Backup: ${backup}`);
    const result = await Events.collection.bulkWrite(changes.map(change => ({ updateOne: {
        filter: { _id: change._id, category: change.oldCategory === undefined ? { $exists: false } : change.oldCategory },
        update: { $set: { category: change.newCategory } }
    } })));
    console.log(`Updated categories: ${result.modifiedCount}`);
    const after = await Events.collection.find({ _id: { $in: changes.map(change => change._id) } }, { projection: { category: 1 } }).toArray();
    const mismatches = after.filter(record => record.category !== matched.get(String(record._id)));
    console.log(`Verification mismatches: ${mismatches.length}`);
    if (mismatches.length || result.matchedCount !== changes.length) process.exitCode = 1;
}

main().catch(error => {
    console.error(error instanceof mongoose.Error ? `Database operation failed (${error.name})` : error.message);
    process.exitCode = 1;
}).finally(() => mongoose.disconnect());
