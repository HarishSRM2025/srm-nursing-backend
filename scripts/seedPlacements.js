require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), quiet: true });
const mongoose = require('mongoose');
const Placement = require('../models/placement');
const data = require('../data/placements.json');

async function seed() {
  try {
    const uri = process.env.DBURL || process.env.MONGODB_URI;
    if (!uri) throw new Error('Configure DBURL or MONGODB_URI before seeding.');
    await new Placement(data).validate();
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    await Placement.init();
    const result = await Placement.updateOne(
      { key: 'placements' }, { $setOnInsert: data }, { upsert: true, runValidators: true },
    );
    const saved = await Placement.findOne({ key: 'placements' }).lean();
    console.log(result.upsertedCount ? 'Placement data inserted.' : 'Existing placement data preserved.');
    console.log(`${saved.batches.length} batches, ${saved.internationalPlacements.length} international placements, ${saved.partners.length} recruiters, ${saved.stats.length} statistics.`);
  } catch (error) {
    console.error('Placement seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
