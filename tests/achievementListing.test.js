const test = require('node:test');
const assert = require('node:assert/strict');
const { typeFilter, listingQuery } = require('../services/achievementListing');
const Achievement = require('../models/achievement');

test('student scope includes legacy records; faculty scope is isolated', () => {
  assert.deepEqual(typeFilter('student'), { $or: [{ type: 'student' }, { type: { $exists: false } }] });
  assert.deepEqual(typeFilter('faculty'), { type: 'faculty' });
});
test('search is literal and does not overwrite type or active filters', () => {
  const result = listingQuery({ search: '[award].*', status: 'active', year: '2026', category: 'Research', page: '2', limit: '6' }, 'student');
  assert.equal(result.base.status, 'active');
  assert.equal(result.filter.$and.length, 4);
  const expression = result.filter.$and[3].$or[0].student_or_batch;
  assert.equal(expression.test('[award].*'), true);
  assert.equal(expression.test('awardanything'), false);
  assert.equal(result.page, 2);
  assert.equal(result.limit, 6);
});
test('invalid filters and pagination are rejected', () => {
  for (const query of [{ year: 'oops' }, { page: '-1' }, { limit: '101' }, { search: {} }, { status: 'unknown' }]) {
    assert.throws(() => listingQuery(query, 'faculty'), { status: 400 });
  }
});
test('legacy unpaginated listing remains supported', () => {
  assert.equal(listingQuery({}, 'student').paginated, false);
  assert.equal(listingQuery({ page: '1' }, 'faculty').paginated, true);
});
test('achievement schema validates recipient, type and year', () => {
  const valid = { student_or_batch: 'Faculty member', award_or_title: 'Research award', year: 2026, type: 'faculty' };
  assert.equal(new Achievement(valid).validateSync(), undefined);
  for (const change of [{ student_or_batch: ' ' }, { year: 2026.5 }, { type: 'other' }]) {
    assert.ok(new Achievement({ ...valid, ...change }).validateSync());
  }
});
