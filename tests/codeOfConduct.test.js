const { test } = require('node:test');
const assert = require('node:assert/strict');
const Model = require('../models/codeOfConduct');
const seed = require('../data/codeOfConduct.json');
const { getSections, saveSection } = require('../controller/codeOfConduct');
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });

test('read order follows numeric rule numbers including nested punishments', () => {
  const normalize = require('../utils/conductOrder');
  const result = normalize({ rules: [
    { num: 10, text: 'Last', punishments: [{ num: 2, text: 'B' }, { num: 1, text: 'A' }] },
    { num: 2, text: 'Second' }, { num: 1, text: 'First' },
  ], boys: [{ num: 2, text: 'B' }, { num: 1, text: 'A' }], table: [{ sno: '2', name: 'B' }, { sno: '1', name: 'A' }] }, true);
  assert.deepEqual(result.rules.map(rule => rule.text), ['First', 'Second', 'Last']);
  assert.deepEqual(result.rules.map(rule => rule.num), [1, 2, 3]);
  assert.deepEqual(result.rules[2].punishments.map(rule => rule.text), ['A', 'B']);
  assert.equal(result.boys[0].text, 'A');
  assert.equal(result.table[0].name, 'A');
});

test('saving respects the chosen array order and renumbers after moves or removals', () => {
  const normalize = require('../utils/conductOrder');
  const result = normalize({ rules: [{ num: 3, text: 'Moved first', subClauses: ['Keep detail'] }, { num: 1, text: 'Moved second' }] });
  assert.deepEqual(result.rules.map(rule => [rule.num, rule.text]), [[1, 'Moved first'], [2, 'Moved second']]);
  assert.deepEqual(result.rules[0].subClauses, ['Keep detail']);
});

test('all nine seed sections validate and preserve nested content', async () => {
  assert.equal(seed.length, 9);
  for (const section of seed) await new Model(section).validate();
  assert.equal(seed.find(s => s.id === 'disciplinary-committee').table.length, 8);
  assert.equal(seed.find(s => s.id === 'hostel').rules.length, 30);
  assert.equal(seed.find(s => s.id === 'ragging').rules[2].punishments.length, 9);
});

test('invalid section ids, lists, titles and nested rules are rejected', async () => {
  for (const [id, body, expected] of [
    ['unknown', {}, 404], ['students', [], 400], ['students', { title: '' }, 400],
    ['students', { title: 'Students', rules: null }, 400],
    ['students', { title: 'Students', rules: [null] }, 400],
    ['students', { title: 'Students', rules: [{ num: -1, text: 'Rule' }] }, 400],
    ['ragging', { title: 'Anti-ragging', rules: [{ num: 1, text: 'Rule', punishments: [{ num: 1, text: '' }] }] }, 400],
    ['students', { title: 'Students', unexpected: true }, 400],
  ]) {
    const res = response();
    await saveSection({ params: { id }, body }, res);
    assert.equal(res.code, expected);
  }
});

test('section save preserves nested details and can clear rules', async (t) => {
  t.mock.method(Model, 'findOneAndUpdate', (filter, update, options) => {
    assert.deepEqual(filter, { id: 'students' });
    assert.equal(options.runValidators, true);
    return { select: () => ({ lean: async () => update.$set }) };
  });
  const body = seed.find(s => s.id === 'students');
  const res = response();
  await saveSection({ params: { id: 'students' }, body }, res);
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.data.rules[12].subClauses, body.rules[12].subClauses);
  await saveSection({ params: { id: 'students' }, body: { title: 'Students', rules: [] } }, res);
  assert.deepEqual(res.body.data.rules, []);
});

test('GET returns ordered data and safe database errors', async (t) => {
  let fail = false;
  t.mock.method(console, 'error', () => {});
  t.mock.method(Model, 'find', () => ({ select: () => ({ lean: async () => {
    if (fail) throw new Error('private database error');
    return structuredClone(seed).reverse();
  } }) }));
  const res = response();
  await getSections({}, res);
  assert.equal(res.body.data[0].id, 'general-rules');
  fail = true;
  await getSections({}, res);
  assert.equal(res.code, 500);
  assert.equal(res.body.message, 'Unable to load the code of conduct.');
});

test('HTTP write route rejects unauthenticated updates', async (t) => {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.use('/api/code-of-conduct', require('../route/codeOfConduct'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const res = await fetch(`http://127.0.0.1:${server.address().port}/api/code-of-conduct/students`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Unauthorized' }),
  });
  assert.equal(res.status, 401);
});
