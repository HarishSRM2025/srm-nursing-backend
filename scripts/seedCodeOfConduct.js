require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), quiet: true });
const mongoose = require('mongoose');
const CodeOfConduct = require('../models/codeOfConduct');
const sections = require('../data/codeOfConduct.json');

async function seed() {
  try {
    const uri = process.env.DBURL || process.env.MONGODB_URI;
    if (!uri) throw new Error('Configure DBURL or MONGODB_URI.');
    for (const section of sections) await new CodeOfConduct(section).validate();
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    await CodeOfConduct.init();
    let inserted = 0;
    for (const section of sections) {
      const result = await CodeOfConduct.updateOne({ id: section.id }, { $setOnInsert: section }, { upsert: true, runValidators: true });
      inserted += result.upsertedCount;
    }
    console.log(`Inserted ${inserted} sections; existing sections preserved.`);
    console.log(`${await CodeOfConduct.countDocuments()} code of conduct sections saved in MongoDB.`);
  } catch (error) {
    console.error('Code of conduct seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
seed();
