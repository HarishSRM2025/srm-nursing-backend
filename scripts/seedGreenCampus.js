/**
 * Standalone seeder for Green Campus (initiatives & gallery).
 * Usage:  npm run seed:green-campus
 *         npm run seed:green-campus -- --force
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const DBURL = process.env.DBURL || process.env.MONGODB_URI;
if (!DBURL) {
  console.error('❌  DBURL not found in .env');
  process.exit(1);
}

const GreenCampusInitiative = require('../models/greenCampusInitiative');
const GreenCampusGallery = require('../models/greenCampusGallery');

const DEFAULT_INITIATIVES = [
  {
    initiativeId: 'clean-campus',
    number: '01',
    title: 'Clean Campus',
    icon: 'FaBroom',
    image: 'gc-clean-campus.jpg',
    imageAlt: 'Nursing students participating in a campus cleanliness drive',
    text: 'SRM Trichy College of Nursing actively integrates eco-friendly practices and sustainability education into its campus culture. Students, faculty, and staff collectively participate in maintaining a green and clean environment through regular cleanliness drives.',
    points: [
      { label: 'Swachh Bharat Mission programs conducted regularly', icon: 'FaCheckCircle' },
      { label: 'Students educated on hygiene and environmental responsibility', icon: 'FaCheckCircle' },
      { label: 'Cleanliness maintained across premises and surrounding areas', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 1,
    status: 'active',
  },
  {
    initiativeId: 'waste-segregation',
    number: '02',
    title: 'Waste Collection, Segregation & Processing',
    icon: 'FaTrashAlt',
    image: 'gc-waste-segregation.jpg',
    imageAlt: 'Color-coded waste segregation bins on campus',
    text: 'The institution actively addresses environmental challenges posed by non-degradable waste through a strict waste segregation system. Segregated waste is regularly sent to authorized recycling facilities, supporting sustainable waste management and a circular economy.',
    points: [
      { label: 'Color-coded bins for biodegradable, recyclable & hazardous waste', icon: 'FaCheckCircle' },
      { label: 'Routine cleaning keeps campus roads dust-free and hygienic', icon: 'FaCheckCircle' },
      { label: 'Waste sent to authorized recyclers, supporting a circular economy', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 2,
    status: 'active',
  },
  {
    initiativeId: 'plastic-ban',
    number: '03',
    title: 'Ban on Single-Use Plastics',
    icon: 'FaBan',
    image: 'gc-plastic-ban.jpg',
    imageAlt: 'Say no to plastic bags awareness poster on campus',
    text: 'SRM Trichy College of Nursing promotes a plastic-free campus by prohibiting single-use plastic covers and plastic water bottles within the institution. Awareness programs are conducted regularly for both students and staff to support this initiative.',
    points: [
      { label: 'Cloth bags encouraged in place of polythene covers', icon: 'FaCheckCircle' },
      { label: 'Reusable water bottles replace single-use plastic bottles', icon: 'FaCheckCircle' },
      { label: 'Regular awareness drives for students and staff', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 3,
    status: 'active',
  },
  {
    initiativeId: 'green-cover',
    number: '04',
    title: 'Green Cover & Landscaping',
    icon: 'FaTree',
    image: 'gc-green-cover.jpg',
    imageAlt: 'Tree-lined avenue and landscaped greenery across campus',
    text: 'The institution promotes a green campus initiative aimed at creating a sustainable and climate-friendly environment, supporting renewable energy practices, energy-efficient measures, recycling, composting, and eco-friendly landscaping throughout the grounds.',
    points: [
      { label: 'Smart irrigation uses sensors and weather data to optimise watering', icon: 'FaCheckCircle' },
      { label: 'Healthy campus greenery maintained year-round', icon: 'FaCheckCircle' },
      { label: 'Composting supports natural soil enrichment', icon: 'FaCheckCircle' },
    ],
    metric: { value: '425+', label: 'Trees planted across campus' },
    order: 4,
    status: 'active',
  },
  {
    initiativeId: 'solar-energy',
    number: '05',
    title: 'Use of Solar Energy & LED Bulbs',
    icon: 'FaSolarPanel',
    image: 'gc-solar-energy.jpg',
    imageAlt: 'Rooftop solar power installation at SRM Trichy',
    text: 'The college has developed a time-bound institutional plan to promote energy conservation by installing a solar power system on the rooftop, enabling effective use of renewable energy for power requirements while lowering electricity costs.',
    points: [
      { label: 'Energy-efficient CFL and LED lighting used widely across campus', icon: 'FaCheckCircle' },
      { label: 'Street lights powered by renewable energy sources', icon: 'FaCheckCircle' },
      { label: 'Supports long-term self-reliance and lower energy costs', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 5,
    status: 'active',
  },
  {
    initiativeId: 'e-vehicles',
    number: '06',
    title: 'Restricted Vehicle Entry & Use of E-Vehicles',
    icon: 'FaShuttleVan',
    image: 'gc-e-vehicles.jpg',
    imageAlt: 'Electric vehicle used for transport within SRM Trichy campus',
    text: "Students' vehicles are not allowed inside the campus and must be parked in the designated parking area near the entrance, supervised by security personnel. This policy helps maintain a pollution-free, eco-friendly, and safer campus environment.",
    points: [
      { label: 'No vehicles permitted within academic premises', icon: 'FaCheckCircle' },
      { label: 'Security-supervised parking near the campus entrance', icon: 'FaCheckCircle' },
      { label: 'Hostel students encouraged to use e-vehicles for commuting', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 6,
    status: 'active',
  },
  {
    initiativeId: 'biogas-plant',
    number: '07',
    title: 'Processing of Food Waste & Bio-Gas Generation',
    icon: 'FaGasPump',
    image: 'gc-biogas-plant.jpg',
    imageAlt: 'Biogas plant meter installed on campus',
    text: 'A biogas plant established on campus supports sustainable waste management and energy conservation. The plant utilizes night soil collected from the hostel and vegetable waste from the canteen to generate biogas used for cooking in the hostel kitchen.',
    points: [
      { label: 'Converts hostel and canteen waste into usable cooking gas', icon: 'FaCheckCircle' },
      { label: 'Reduces methane emissions through effective recycling', icon: 'FaCheckCircle' },
      { label: 'Lowers dependence on conventional LPG supply', icon: 'FaCheckCircle' },
    ],
    metric: { value: '696 kg', label: 'LPG-equivalent energy saved annually' },
    order: 7,
    status: 'active',
  },
  {
    initiativeId: 'rainwater-harvesting',
    number: '08',
    title: 'Rain Water Harvesting',
    icon: 'FaTint',
    image: 'gc-rainwater-harvesting.jpg',
    imageAlt: 'Rainwater harvesting pipeline system installed on campus',
    text: 'SRM Trichy College of Nursing has implemented a comprehensive rainwater harvesting system across the campus. Strategically placed collection points at rooftops and designated catchment areas collect and store rainwater for future use.',
    points: [
      { label: 'Rooftop and ground-level catchment areas across campus', icon: 'FaCheckCircle' },
      { label: 'Reduces dependence on external water sources', icon: 'FaCheckCircle' },
      { label: 'Promotes responsible, natural water conservation', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 8,
    status: 'active',
  },
  {
    initiativeId: 'water-treatment',
    number: '09',
    title: 'Water Monitoring & Wastewater Treatment',
    icon: 'FaWater',
    image: 'gc-water-treatment.jpg',
    imageAlt: 'Students walking past the water treatment facility on campus',
    text: 'The campus is equipped with advanced facilities supporting effective water conservation and management, including a Reverse Osmosis (RO) plant with UV treatment to ensure water quality meets high institutional standards.',
    points: [
      { label: 'Sewage treatment plants process wastewater from college and hostels', icon: 'FaCheckCircle' },
      { label: 'Treated water reused for flushing via a dual-pipe system', icon: 'FaCheckCircle' },
      { label: 'Promotes efficient, sustainable water resource management', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 9,
    status: 'active',
  },
  {
    initiativeId: 'pedestrian-pathways',
    number: '10',
    title: 'Pedestrian Friendly Pathways',
    icon: 'FaWalking',
    image: 'gc-pedestrian-pathways.jpg',
    imageAlt: 'Pedestrian-friendly walkway leading to the main college block',
    text: "Since students' vehicles are not permitted inside the campus, a well-planned pedestrian-friendly pathway has been constructed from the entrance to the main college block, ensuring safe and comfortable movement for everyone.",
    points: [
      { label: 'Dedicated walkway from entrance to academic blocks', icon: 'FaCheckCircle' },
      { label: 'Encourages walking over vehicle dependence', icon: 'FaCheckCircle' },
      { label: 'Supports a clean, eco-friendly campus environment', icon: 'FaCheckCircle' },
    ],
    metric: null,
    order: 10,
    status: 'active',
  },
];

const DEFAULT_GALLERY = [
  {
    title: 'Campus Greenery',
    image: 'gc-gallery-1.jpg',
    alt: 'Campus greenery and tree-lined road',
    order: 1,
    status: 'active',
  },
  {
    title: 'Waste Segregation Bins',
    image: 'gc-gallery-2.jpg',
    alt: 'Waste segregation bins close-up',
    order: 2,
    status: 'active',
  },
  {
    title: 'Solar Panels on Rooftop',
    image: 'gc-gallery-3.jpg',
    alt: 'Solar panels on rooftop',
    order: 3,
    status: 'active',
  },
  {
    title: 'Campus Cleanliness Drive',
    image: 'gc-gallery-4.jpg',
    alt: 'Students on a cleanliness drive',
    order: 4,
    status: 'active',
  },
];

async function seed() {
  const force = process.argv.includes('--force');

  try {
    console.log('⏳  Connecting to MongoDB…');
    await mongoose.connect(DBURL);
    console.log('✅  Connected');

    if (force) {
      await GreenCampusInitiative.deleteMany({});
      await GreenCampusGallery.deleteMany({});
      console.log('🗑️   Existing Green Campus data dropped');
    }

    const initCount = await GreenCampusInitiative.countDocuments();
    if (initCount > 0 && !force) {
      console.log(`ℹ️   ${initCount} initiatives already exist. Use --force to reseed.`);
    } else {
      for (const data of DEFAULT_INITIATIVES) {
        await GreenCampusInitiative.findOneAndUpdate(
          { initiativeId: data.initiativeId },
          data,
          { upsert: true, returnDocument: 'after' }
        );
      }
      console.log(`✅  ${DEFAULT_INITIATIVES.length} initiatives seeded`);
    }

    const galCount = await GreenCampusGallery.countDocuments();
    if (galCount > 0 && !force) {
      console.log(`ℹ️   ${galCount} gallery items already exist. Use --force to reseed.`);
    } else {
      for (const data of DEFAULT_GALLERY) {
        await GreenCampusGallery.findOneAndUpdate(
          { image: data.image },
          data,
          { upsert: true, returnDocument: 'after' }
        );
      }
      console.log(`✅  ${DEFAULT_GALLERY.length} gallery items seeded`);
    }

    const allInits = await GreenCampusInitiative.find().sort({ order: 1 });
    console.log('\nGreen Campus Initiatives in DB:');
    allInits.forEach((i) => console.log(`  ${i.number}. ${i.title} [${i.initiativeId}]`));

    const allGals = await GreenCampusGallery.find().sort({ order: 1 });
    console.log('\nGreen Campus Gallery in DB:');
    allGals.forEach((g) => console.log(`  ${g.order}. ${g.title} (${g.image})`));
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌  Disconnected');
  }
}

seed();

