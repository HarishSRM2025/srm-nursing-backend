const mongoose = require('mongoose');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const plainEventTitle = require('../utils/plainEventTitle');
const Events = require('../models/events/events');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

async function main() {
    if (!process.env.DBURL) throw new Error('DBURL is not configured');
    await mongoose.connect(process.env.DBURL, { serverSelectionTimeoutMS: 10000 });
    const records = await Events.collection.find({ title: { $type: 'string' } }, { projection: { title: 1 } }).toArray();
    const changes = records.map(event => ({ ...event, cleaned: plainEventTitle(event.title) }))
        .filter(event => event.title !== event.cleaned);
    if (!changes.length) { console.log('All event titles are already plain text.'); return; }
    const backup = path.join(os.tmpdir(), `event-title-backup-${Date.now()}.json`);
    await fs.writeFile(backup, JSON.stringify(changes, null, 2), { flag: 'wx' });
    console.log(`Backed up ${changes.length} original titles to ${backup}`);
    // Match the original title too, so a concurrent edit is never overwritten.
    const result = await Events.collection.bulkWrite(changes.map(event => ({ updateOne: {
        filter: { _id: event._id, title: event.title }, update: { $set: { title: event.cleaned } }
    } })));
    console.log(`Updated ${result.modifiedCount} event titles.`);
    const after = await Events.collection.find({ title: { $type: 'string' } }, { projection: { title: 1 } }).toArray();
    const remaining = after.filter(event => plainEventTitle(event.title) !== event.title).length;
    console.log(`Titles still needing cleanup: ${remaining}`);
    if (remaining) process.exitCode = 1;
}

main().catch(error => {
    console.error(`Title cleanup failed (${error.name}). Check database connectivity and configuration.`);
    process.exitCode = 1;
}).finally(() => mongoose.disconnect());
