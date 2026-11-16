const { test } = require('node:test');
const assert = require('node:assert/strict');
const Placement = require('../models/placement');
const data = require('../data/placements.json');
const { getPlacements } = require('../controller/placement');
const { updateSection } = require('../controller/placement');
const requireAdmin = require('../middleware/requireAdmin');
const AdminUser = require('../models/adminUser');
const jwt = require('jsonwebtoken');

const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });

test('section updates reject unknown sections, malformed payloads and invalid records', async () => {
  for (const [section, body, code] of [
    ['unknown', { items: [] }, 404], ['partners', {}, 400],
    ['partners', { items: [null] }, 400], ['partners', { items: [{}] }, 400],
    ['batches', { items: [{ year: '2025', total: '1', hospitals: [{ name: 'Hospital', count: -1 }] }] }, 400],
  ]) {
    const res = response();
    await updateSection({ params: { section }, body }, res);
    assert.equal(res.code, code);
  }
});

test('saving and clearing a section only updates that section', async (t) => {
  const writes = [];
  t.mock.method(Placement, 'findOneAndUpdate', (filter, update, options) => {
    writes.push({ filter, update, options });
    return { select: () => ({ lean: async () => ({ ...data, ...update.$set }) }) };
  });
  for (const items of [[{ name: 'Test hospital', location: 'Trichy' }], []]) {
    const res = response();
    await updateSection({ params: { section: 'partners' }, body: { items } }, res);
    assert.equal(res.code, 200);
    assert.deepEqual(res.body.data.partners, items);
    assert.deepEqual(res.body.data.batches, data.batches);
    assert.deepEqual(Object.keys(writes.at(-1).update.$set), ['partners']);
    assert.equal(writes.at(-1).options.runValidators, true);
  }
});

test('write access requires a valid token and an existing administrator', async (t) => {
  let role = 'admin';
  t.mock.method(AdminUser, 'findById', () => ({ select: async () => role ? { role } : null }));
  const token = jwt.sign({ id: 'test-admin' }, process.env.JWT_SECRET || 'srm_nursing_admin_secret_key_2026');
  for (const [authorization, userRole, expected] of [[undefined, 'admin', 401], ['Bearer invalid', 'admin', 401], [`Bearer ${token}`, 'student', 403], [`Bearer ${token}`, null, 403], [`Bearer ${token}`, 'admin', 200]]) {
    role = userRole;
    const res = response();
    let called = false;
    await requireAdmin({ headers: { authorization } }, res, () => { called = true; });
    assert.equal(res.code, expected);
    assert.equal(called, expected === 200);
  }
});

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
