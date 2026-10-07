const test = require('node:test');
const assert = require('node:assert/strict');
const ExcelJS = require('exceljs');
const Research = require('../models/research/research');
const { importResearch, createTemplate } = require('../services/researchImport');

async function workbook(rows) {
  const book = new ExcelJS.Workbook();
  book.addWorksheet('Research').addRows(rows);
  return book.xlsx.writeBuffer();
}

test('imports research without a recipient and reports invalid rows individually', async () => {
  const saved = [];
  class Model extends Research {
    async save() { saved.push(this.toObject()); return this; }
  }
  const result = await importResearch(await workbook([
    ['title', 'year', 'status'],
    [' Study ', 2026, ''],
    ['', 2026, ''],
    ['Invalid year', 2026.5, ''],
    ['Invalid status', 2026, 'other'],
    ['Second study', 2025, 'inactive'],
    [{ formula: '1+1', result: 2 }, 2026, ''],
  ]), Model);
  assert.equal(result.imported, 2);
  assert.equal(result.failed, 4);
  assert.equal(result.results[1].row, 3);
  assert.equal(saved[0].title, 'Study');
  assert.equal(saved[0].status, 'active');
  assert.equal(saved[1].status, 'inactive');
  for (const field of ['faculty_name', 'student_or_batch', 'type']) {
    assert.equal(Research.schema.path(field), undefined);
  }
  assert.equal(Research.collection.name, 'publications');
  assert.equal(require('../models/publication'), Research);
});

test('rejects invalid workbooks, headers, empty sheets and more than 500 rows', async () => {
  await assert.rejects(importResearch(Buffer.from('invalid')), /valid .xlsx/);
  for (const headers of [['year'], ['title', 'title', 'year'], ['title', 'year', 'faculty_name']]) {
    await assert.rejects(importResearch(await workbook([headers, ['data']])), { status: 400 });
  }
  await assert.rejects(importResearch(await createTemplate()), /between 1 and 500/);
  await assert.rejects(importResearch(await workbook([
    ['title', 'year'], ...Array.from({ length: 501 }, () => ['Study', 2026]),
  ])), /500/);
});

test('publication routes provide the research template, multipart import and recipient-free create', async t => {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.use('/api/publication', require('../route/publication'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const saved = [];
  t.mock.method(Research.prototype, 'save', async function () { saved.push(this.toObject()); return this; });
  t.mock.method(Research, 'countDocuments', async () => 0);
  const url = `http://127.0.0.1:${server.address().port}/api/publication`;
  const template = await fetch(`${url}/template`);
  assert.equal(template.status, 200);
  assert.match(template.headers.get('content-type'), /spreadsheetml/);
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(Buffer.from(await template.arrayBuffer()));
  assert.deepEqual(book.worksheets[0].getRow(1).values.slice(1), ['title', 'year', 'description', 'status', 'institution', 'document_title']);
  assert.equal(book.worksheets[0].rowCount, 1);
  assert.equal((await fetch(`${url}/bulk-upload`, { method: 'POST' })).status, 400);
  for (const [rows, expected] of [
    [[['Study', 2026], ['', 2026]], 207],
    [[['Study', 2026]], 201],
    [[['', 2026]], 422],
  ]) {
    const body = new FormData();
    body.append('file', new Blob([await workbook([['title', 'year'], ...rows])]), 'research.xlsx');
    const response = await fetch(`${url}/bulk-upload`, { method: 'POST', body });
    assert.equal(response.status, expected);
    assert.equal((await response.json()).total, rows.length);
  }
  const created = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Research only', year: 2026, faculty_name: 'Ignored' }),
  });
  assert.equal(created.status, 201);
  assert.equal((await created.json()).publication.title, 'Research only');
  assert.equal(saved.at(-1).faculty_name, undefined);
});
