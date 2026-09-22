const { test } = require('node:test');
const assert = require('node:assert/strict');
const { listEvents, listingQuery } = require('../services/eventListing');

test('Events and CNE scopes are complementary and persist through category selection', () => {
    const events = listingQuery({ scope: 'events', category: 'Workshop' });
    const cne = listingQuery({ scope: 'cne', category: 'Workshop' });
    for (const label of ['Event', 'Events', 'event', ' EVENTS ']) {
        assert.equal(events.base.$and[0].category.test(label), true);
        assert.equal(cne.base.$and[0].category.$not.test(label), true);
    }
    assert.equal(events.base.$and[0].category.test('Workshop'), false);
    assert.equal(cne.base.$and[0].category.$not.test('Workshop'), false);
    assert.deepEqual(cne.filter.$and, cne.base.$and);
    assert.equal(cne.filter.category, 'Workshop');
    assert.equal(listingQuery({}).base.$and, undefined);
    assert.throws(() => listingQuery({ scope: 'bad' }), { statusCode: 400 });
});

test('validates pagination and escapes search while combining filters', () => {
    const result = listingQuery({ page: '2', limit: '6', search: 'a.b', category: 'Seminar', status: 'Completed', activeOnly: 'true', year: '2026', month: 'Sep', tags: 'health, nursing' });
    assert.equal(result.page, 2);
    assert.equal(result.filter.$or[0].title.$regex, 'a\\.b');
    assert.equal(result.filter.category, 'Seminar');
    assert.equal(result.filter.status, 'Completed');
    assert.deepEqual(result.filter.isActive, { $ne: 'INACTIVE' });
    assert.deepEqual(result.filter.tags, { $in: ['health', 'nursing'] });
    assert.equal(result.filter.$expr.$and.length, 2);
    for (const query of [{ page: '0' }, { limit: '101' }, { search: {} }, { month: 'bad' }, { status: 'bad' }]) {
        assert.throws(() => listingQuery(query), { statusCode: 400 });
    }
});

test('requests only a bounded batch with stable order and global filter metadata', async () => {
    const calls = {};
    const chain = {
        sort(value) { calls.sort = value; return this; },
        skip(value) { calls.skip = value; return this; },
        limit(value) { calls.limit = value; return this; },
        async lean() { return [{ title: 'Last event' }]; }
    };
    const model = {
        async countDocuments(filter) { calls.filter = filter; return 21; },
        find() { return chain; },
        async aggregate(pipeline) {
            calls.pipeline = pipeline;
            return [{ categories: [{ _id: 'Seminar', count: 30 }], years: [{ _id: 2026 }], total: [{ count: 30 }] }];
        }
    };
    const result = await listEvents({ page: '99', limit: '10', activeOnly: 'true', search: 'event', includeFilters: 'true' }, model);
    assert.deepEqual(result.pagination, { page: 3, limit: 10, total: 21, totalPages: 3 });
    assert.equal(calls.skip, 20);
    assert.equal(calls.limit, 10);
    assert.deepEqual(calls.sort, { _id: -1 });
    assert.deepEqual(calls.pipeline[0], { $match: { isActive: { $ne: 'INACTIVE' } } });
    assert.equal(result.filters.total, 30);
    assert.deepEqual(result.filters.years, ['2026']);
    model.countDocuments = async () => 0;
    chain.lean = async () => [];
    const empty = await listEvents({ page: '3' }, model);
    assert.equal(empty.pagination.page, 1);
    assert.equal(empty.pagination.total, 0);
    assert.equal(calls.skip, 0);
});
