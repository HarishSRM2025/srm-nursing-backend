const { test } = require('node:test');
const assert = require('node:assert/strict');
const Placement = require('../models/placement');
const data = require('../data/placements.json');
const { getPlacements } = require('../controller/placement');

test('seed data validates and contains all page sections', async () => {
  await new Placement(data).validate();
  assert.equal(data.batches.length, 4);
  assert.equal(data.internationalPlacements.length, 3);
  assert.equal(data.partners.length, 12);
  assert.equal(data.stats.length, 4);
});

test('rejects negative and fractional hospital counts', async () => {
  for (const count of [-1, 1.5]) {
    const invalid = structuredClone(data);
    invalid.batches[0].hospitals[0].count = count;
    await assert.rejects(new Placement(invalid).validate(), /count/);
  }
});

test('API returns content, missing-data status, and safe database errors', async (t) => {
  let value = data;
  let fail = false;
  t.mock.method(Placement, 'findOne', () => ({ select: () => ({ lean: async () => {
    if (fail) throw new Error('database unavailable');
    return value;
  } }) }));
  t.mock.method(console, 'error', () => {});
  const res = { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await getPlacements({}, res);
  assert.deepEqual(res.body, { success: true, data });
  value = null;
  await getPlacements({}, res);
  assert.equal(res.code, 404);
  fail = true;
  await getPlacements({}, res);
  assert.equal(res.code, 500);
  assert.equal(res.body.message, 'Unable to load placements.');
});
