const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const ExcelJS = require('exceljs');
const express = require('express');
const Events = require('../models/events/events');
const { importEvents } = require('../services/eventImport');

async function spreadsheet(headers, rows) {
    const book = new ExcelJS.Workbook();
    const sheet = book.addWorksheet('Events');
    sheet.addRow(headers);
    rows.forEach(row => sheet.addRow(row));
    return book.xlsx.writeBuffer();
}

async function fixture(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'event-import-test-'));
    t.after(async () => {
        assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
        assert.ok(path.basename(root).startsWith('event-import-test-'));
        await fs.rm(root, { recursive: true, force: true });
    });
    const sourceRoot = path.join(root, 'source');
    const destinationRoot = path.join(root, 'destination');
    await fs.mkdir(path.join(sourceRoot, '2023', '11'), { recursive: true });
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64');
    await fs.writeFile(path.join(sourceRoot, '2023', '11', 'one.png'), png);
    await fs.writeFile(path.join(sourceRoot, 'two.png'), png);
    const saved = [];
    class FakeEvent extends Events {
        async save() {
            if (this.title === 'Database failure') throw new Error('Simulated database failure');
            saved.push(this.toObject());
            return this;
        }
    }
    return { sourceRoot, destinationRoot, EventModel: FakeEvent, saved, png };
}

test('imports all fields, ordered images, Excel dates, tags, and defaults', async t => {
    const options = await fixture(t);
    const file = await spreadsheet(
        ['title', 'description', 'startDate', 'endDate', 'venue', 'category', 'tags', 'image', 'status', 'registrationFee', 'isActive', 'registrationLink'],
        [['Event', 'Description', new Date('2026-10-01T00:00:00Z'), '2026-10-02', 'Hall', 'Workshop', 'nursing, students', 'uploads/2023/11/one.png, two.png', '', 0, '', 'https://example.com/register']]
    );
    const result = await importEvents(file, options);
    assert.equal(result.imported, 1);
    assert.equal(result.failed, 0);
    assert.equal(result.results[0].row, 2);
    const event = options.saved[0];
    assert.deepEqual(event.tags, ['nursing', 'students']);
    assert.equal(event.startDate.toISOString(), '2026-10-01T00:00:00.000Z');
    assert.equal(event.status, 'Upcoming');
    assert.equal(event.isActive, 'ACTIVE');
    assert.equal(event.registrationFee, '0');
    assert.equal(event.image.length, 2);
    assert.notEqual(event.image[0], event.image[1]);
    for (const image of event.image) {
        assert.match(image, /^uploads\/[\w-]+\.png$/);
        assert.deepEqual(await fs.readFile(path.join(options.destinationRoot, path.basename(image))), options.png);
    }
    assert.deepEqual(await fs.readFile(path.join(options.sourceRoot, 'two.png')), options.png);
});

test('isolates invalid rows and leaves no images for failed events', async t => {
    const options = await fixture(t);
    const file = await spreadsheet(['title', 'image', 'startDate', 'endDate', 'status', 'isActive'], [
        ['Missing image', 'two.png, missing.png'],
        ['Bad date', '', '2026-02-30'],
        ['Reversed dates', '', '2026-10-02', '2026-10-01'],
        ['Bad status', '', '', '', 'Finished'],
        ['Bad active', '', '', '', '', 'YES'],
        ['Database failure', 'two.png'],
        [],
        ['Valid event', 'uploads\\2023\\11\\one.png'],
        ['', 'two.png']
    ]);
    const result = await importEvents(file, options);
    assert.equal(result.total, 8);
    assert.equal(result.imported, 1);
    assert.equal(result.failed, 7);
    assert.equal(result.results.find(row => row.success).row, 9);
    assert.match(result.results[0].error, /not found/);
    assert.match(result.results[1].error, /invalid date/);
    assert.match(result.results[5].error, /Simulated database failure/);
    assert.equal((await fs.readdir(options.destinationRoot)).length, 1);
});

test('rejects traversal, absolute paths, nonimages and directory references', async t => {
    const options = await fixture(t);
    await fs.writeFile(path.join(options.sourceRoot, 'fake.png'), 'this is not an image');
    const file = await spreadsheet(['title', 'image'], [
        ['Traversal', '../outside.png'],
        ['Windows traversal', '..\\outside.png'],
        ['Absolute', 'C:\\outside.png'],
        ['Unix absolute', '/outside.png'],
        ['URL', 'https://example.com/image.png'],
        ['Fake', 'fake.png'],
        ['Directory', '2023']
    ]);
    const report = await importEvents(file, options);
    assert.equal(report.failed, 7);
    assert.equal(report.imported, 0);
    assert.equal(options.saved.length, 0);
});

test('rejects symlinks or junctions escaping the source folder', async t => {
    const options = await fixture(t);
    const outside = path.join(path.dirname(options.sourceRoot), 'outside');
    await fs.mkdir(outside);
    await fs.writeFile(path.join(outside, 'image.png'), options.png);
    await fs.symlink(outside, path.join(options.sourceRoot, 'linked'), 'junction');
    const report = await importEvents(await spreadsheet(['title', 'image'], [['Escape', 'linked/image.png']]), options);
    assert.equal(report.failed, 1);
    assert.match(report.results[0].error, /outside uploads/);
});

test('rejects malformed workbooks and headers before saving', async t => {
    const options = await fixture(t);
    await assert.rejects(importEvents(Buffer.from('invalid'), options), /valid .xlsx/);
    for (const [headers, rows, pattern] of [
        [['description'], [['test']], /title column/],
        [['title', 'title'], [['one', 'two']], /Duplicate/],
        [['title', 'typo'], [['one', 'two']], /Unknown/],
        [['title'], [], /no event rows/],
        [['title'], Array.from({ length: 501 }, () => ['Event']), /at most 500/]
    ]) {
        await assert.rejects(importEvents(await spreadsheet(headers, rows), options), pattern);
    }
    assert.equal(options.saved.length, 0);
});

test('supports rich text and hyperlinks but rejects formula cells', async t => {
    const options = await fixture(t);
    const file = await spreadsheet(['title', 'registrationLink'], [
        [{ richText: [{ text: 'Nursing ' }, { text: 'workshop' }] }, { text: 'https://example.com', hyperlink: 'https://example.com' }],
        [{ formula: '1+1', result: 2 }]
    ]);
    const report = await importEvents(file, options);
    assert.equal(report.imported, 1);
    assert.equal(options.saved[0].title, 'Nursing workshop');
    assert.equal(report.failed, 1);
    assert.match(report.results[1].error, /paste values/);
});

test('HTTP endpoint accepts multipart Excel, reports row errors, and rejects bad uploads', async t => {
    t.mock.method(Events.prototype, 'save', async function () { return this; });
    const app = express();
    app.use('/api/events', require('../route/events'));
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const url = `http://127.0.0.1:${server.address().port}/api/events/bulk-upload`;
    async function upload(buffer, filename = 'events.xlsx', field = 'file') {
        const form = new FormData();
        if (buffer) form.append(field, new Blob([buffer]), filename);
        return fetch(url, { method: 'POST', body: form });
    }
    const valid = await spreadsheet(['title'], [['Event']]);
    const response = await upload(valid);
    assert.equal(response.status, 201);
    assert.equal((await response.json()).imported, 1);
    const partial = await upload(await spreadsheet(['title', 'status'], [['Valid'], ['Invalid', 'bad']]));
    assert.equal(partial.status, 207);
    assert.equal((await partial.json()).failed, 1);
    assert.equal((await upload(await spreadsheet(['title', 'status'], [['Invalid', 'bad']]))).status, 422);
    assert.equal((await upload()).status, 400);
    assert.equal((await upload(valid, 'events.xls')).status, 400);
    assert.equal((await upload(valid, 'events.xlsx', 'wrongField')).status, 400);
    assert.equal((await upload(Buffer.from('broken'))).status, 400);
    assert.equal((await upload(Buffer.alloc(10 * 1024 * 1024 + 1))).status, 413);
});
