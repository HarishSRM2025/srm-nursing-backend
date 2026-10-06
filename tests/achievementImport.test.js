const test = require('node:test');
const assert = require('node:assert/strict');
const ExcelJS = require('exceljs');
const Achievement = require('../models/achivement/facultyAchievement');
const { importAchievements, createTemplate } = require('../services/achievementImport');

async function workbook(rows) {
  const book = new ExcelJS.Workbook();
  book.addWorksheet('Achievements').addRows(rows);
  return book.xlsx.writeBuffer();
}

test('imports valid rows with model defaults and reports invalid rows without saving them', async () => {
  const saved = [];
  class Model extends Achievement {
    async save() { saved.push(this.toObject()); return this; }
  }
  const buffer = await workbook([
    ['student_or_batch', 'award_or_title', 'year', 'category'],
    ['Faculty A', 'Research Award', 2026, 'Research'],
    ['', 'Missing recipient', 2026, ''],
    ['Faculty B', 'Invalid year', 2026.5, ''],
    ['Faculty C', 'Invalid category', 2026, 'Other'],
    ['Faculty D', 'Default category', 2025, ''],
  ]);
  const result = await importAchievements(buffer, 'faculty', Model);
  assert.equal(result.imported, 2);
  assert.equal(result.failed, 3);
  assert.equal(result.results[1].row, 3);
  assert.equal(saved[0].type, 'faculty');
  assert.equal(saved[1].category, 'General');
  assert.equal(saved[1].status, 'active');
});

test('rejects malformed workbooks, missing/duplicate/unknown headers and oversized imports', async () => {
  await assert.rejects(importAchievements(Buffer.from('invalid')), /valid .xlsx/);
  for (const headers of [['year'], ['student_or_batch', 'student_or_batch'], ['type']]) {
    await assert.rejects(importAchievements(await workbook([headers, ['data']])), { status: 400 });
  }
  await assert.rejects(importAchievements(await workbook([
    ['student_or_batch', 'award_or_title', 'year'],
    ...Array.from({ length: 501 }, () => ['A', 'Award', 2026]),
  ])), /500/);
});

test('template contains headers only and imports reject empty templates', async () => {
  const buffer = await createTemplate();
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(buffer);
  assert.equal(book.worksheets[0].rowCount, 1);
  await assert.rejects(importAchievements(buffer), /between 1 and 500/);
});

test('HTTP routes accept multipart uploads, force faculty scope and expose a blank template', async t => {
  const express = require('express');
  const app = express();
  app.use('/api/faculty-achievements', (req, res, next) => { req.achievementType = 'faculty'; next(); }, require('../route/achievement'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const saved = [];
  t.mock.method(Achievement.prototype, 'save', async function () { saved.push(this.toObject()); return this; });
  const url = `http://127.0.0.1:${server.address().port}/api/faculty-achievements`;
  const template = await fetch(`${url}/template`);
  assert.equal(template.status, 200);
  assert.match(template.headers.get('content-type'), /spreadsheetml/);
  assert.equal((await fetch(`${url}/bulk-upload`, { method: 'POST' })).status, 400);
  const body = new FormData();
  body.append('file', new Blob([await workbook([
    ['student_or_batch', 'award_or_title', 'year'], ['Faculty A', 'Award', 2026], ['', 'Invalid', 2026],
  ])]), 'achievements.xlsx');
  const response = await fetch(`${url}/bulk-upload`, { method: 'POST', body });
  assert.equal(response.status, 207);
  const report = await response.json();
  assert.equal(report.imported, 1);
  assert.equal(report.failed, 1);
  assert.equal(saved[0].type, 'faculty');
  assert.equal((await fetch(`${url}/seed`)).status, 400);
});
