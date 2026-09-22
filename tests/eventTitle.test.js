const { test } = require('node:test');
const assert = require('node:assert/strict');
const clean = require('../utils/plainEventTitle');
const Events = require('../models/events/events');

test('removes formatting tags and preserves event text', () => {
    assert.equal(clean('<strong>MOTIVATIONAL SPEECH</strong>'), 'MOTIVATIONAL SPEECH');
    assert.equal(clean('<p>A <em>nursing</em> event</p>'), 'A nursing event');
    assert.equal(clean('<span title="a > b">Event</span>'), 'Event');
    assert.equal(clean('Health & Wellness: 2 < 3'), 'Health & Wellness: 2 < 3');
    assert.equal(clean('<!-- note -->Event<script>alert(1)</script>'), 'Event');
    assert.equal(clean(clean('<b>Event</b>')), 'Event');
});

test('schema cleans titles on creation and update casting', () => {
    const event = new Events({ title: '<strong>Workshop</strong>' });
    assert.equal(event.title, 'Workshop');
    const update = Events.updateOne({}, { $set: { title: '<b>Seminar</b>' } });
    assert.equal(update._castUpdate(update.getUpdate()).$set.title, 'Seminar');
});
