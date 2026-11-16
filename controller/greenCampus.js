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

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const parseJsonIfNeeded = (value, fallback = []) => {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      const split = value.split('\n').map((s) => s.trim()).filter(Boolean);
      return split.map((line) => ({ label: line, icon: 'FaCheckCircle' }));
    }
  }
  return fallback;
};

// GET /api/green-campus (Full page data: active initiatives + active gallery)
exports.getFullGreenCampus = async (req, res) => {
  try {
    const initiatives = await GreenCampusInitiative.find({ status: 'active' }).sort({ order: 1 });
    const gallery = await GreenCampusGallery.find({ status: 'active' }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      initiatives,
      gallery,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch green campus data', error: error.message });
  }
};

// GET /api/green-campus/initiatives
exports.getAllInitiatives = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { initiativeId: regex },
        { text: regex },
        { number: regex },
      ];
    }

    const initiatives = await GreenCampusInitiative.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: initiatives.length, initiatives });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch initiatives', error: error.message });
  }
};

// GET /api/green-campus/initiatives/:id
exports.getInitiativeById = async (req, res) => {
  try {
    const { id } = req.params;
    let initiative = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      initiative = await GreenCampusInitiative.findById(id);
    }
    if (!initiative) {
      initiative = await GreenCampusInitiative.findOne({ initiativeId: id.toLowerCase() });
    }

    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    res.status(200).json({ success: true, initiative });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch initiative', error: error.message });
  }
};

// POST /api/green-campus/initiatives
exports.createInitiative = async (req, res) => {
  try {
    const { title, initiativeId, number, icon, text, imageAlt, points, metric, order, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const generatedId = initiativeId && initiativeId.trim() ? slugify(initiativeId) : slugify(title);

    const existing = await GreenCampusInitiative.findOne({ initiativeId: generatedId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Initiative ID '${generatedId}' already exists. Please choose a unique ID.`,
      });
    }

    const imageFilename = req.file ? req.file.filename : (req.body.image || '');

    let parsedMetric = null;
    if (metric) {
      if (typeof metric === 'string') {
        try {
          parsedMetric = JSON.parse(metric);
        } catch {
          parsedMetric = null;
        }
      } else if (typeof metric === 'object') {
        parsedMetric = metric;
      }
    }

    const initiative = new GreenCampusInitiative({
      initiativeId: generatedId,
      number: number ? number.trim() : '',
      title: title.trim(),
      icon: icon ? icon.trim() : 'FaLeaf',
      image: imageFilename,
      imageAlt: imageAlt ? imageAlt.trim() : title.trim(),
      text: text ? text.trim() : '',
      points: parseJsonIfNeeded(points, []),
      metric: parsedMetric && parsedMetric.value ? parsedMetric : null,
      order: order !== undefined && order !== '' ? Number(order) : 0,
      status: status || 'active',
    });

    await initiative.save();
    res.status(201).json({ success: true, message: 'Initiative created successfully', initiative });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create initiative', error: error.message });
  }
};

// PUT /api/green-campus/initiatives/:id
exports.updateInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    let initiative = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      initiative = await GreenCampusInitiative.findById(id);
    }
    if (!initiative) {
      initiative = await GreenCampusInitiative.findOne({ initiativeId: id.toLowerCase() });
    }

    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    const { title, initiativeId, number, icon, text, imageAlt, points, metric, order, status, image } = req.body;
    const updateDoc = {};

    if (title && title.trim()) updateDoc.title = title.trim();
    if (number !== undefined) updateDoc.number = number.trim ? number.trim() : number;
    if (icon !== undefined) updateDoc.icon = icon.trim ? icon.trim() : icon;
    if (text !== undefined) updateDoc.text = text.trim ? text.trim() : text;
    if (imageAlt !== undefined) updateDoc.imageAlt = imageAlt.trim ? imageAlt.trim() : imageAlt;

    if (initiativeId && initiativeId.trim()) {
      const newSlug = slugify(initiativeId);
      if (newSlug !== initiative.initiativeId) {
        const conflict = await GreenCampusInitiative.findOne({
          initiativeId: newSlug,
          _id: { $ne: initiative._id },
        });
        if (conflict) {
          return res.status(400).json({ success: false, message: `Initiative ID '${newSlug}' is already taken.` });
        }
        updateDoc.initiativeId = newSlug;
      }
    }

    if (req.file) {
      updateDoc.image = req.file.filename;
    } else if (image !== undefined && image !== '') {
      updateDoc.image = image;
    }

    if (points !== undefined) {
      updateDoc.points = parseJsonIfNeeded(points, initiative.points);
    }

    if (metric !== undefined) {
      if (!metric || metric === 'null') {
        updateDoc.metric = null;
      } else if (typeof metric === 'string') {
        try {
          const parsed = JSON.parse(metric);
          updateDoc.metric = parsed.value ? parsed : null;
        } catch {
          updateDoc.metric = null;
        }
      } else if (typeof metric === 'object') {
        updateDoc.metric = metric.value ? metric : null;
      }
    }

    if (order !== undefined && order !== '') {
      updateDoc.order = Number(order);
    }

    if (status !== undefined) {
      updateDoc.status = status;
    }

    const updated = await GreenCampusInitiative.findByIdAndUpdate(
      initiative._id,
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, message: 'Initiative updated successfully', initiative: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update initiative', error: error.message });
  }
};

// DELETE /api/green-campus/initiatives/:id
exports.deleteInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    let initiative = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      initiative = await GreenCampusInitiative.findByIdAndDelete(id);
    }
    if (!initiative) {
      initiative = await GreenCampusInitiative.findOneAndDelete({ initiativeId: id.toLowerCase() });
    }

    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    res.status(200).json({ success: true, message: 'Initiative deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete initiative', error: error.message });
  }
};

// ─── GALLERY HANDLERS ───

// GET /api/green-campus/gallery
exports.getAllGallery = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }
    const gallery = await GreenCampusGallery.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: gallery.length, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery', error: error.message });
  }
};

// POST /api/green-campus/gallery
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, alt, order, status } = req.body;
    const imageFilename = req.file ? req.file.filename : (req.body.image || '');

    if (!imageFilename) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const item = new GreenCampusGallery({
      title: title ? title.trim() : '',
      image: imageFilename,
      alt: alt ? alt.trim() : title ? title.trim() : 'Green Campus Gallery',
      order: order !== undefined && order !== '' ? Number(order) : 0,
      status: status || 'active',
    });

    await item.save();
    res.status(201).json({ success: true, message: 'Gallery item added successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add gallery item', error: error.message });
  }
};

// PUT /api/green-campus/gallery/:id
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GreenCampusGallery.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    const { title, alt, order, status, image } = req.body;
    const updateDoc = {};

    if (title !== undefined) updateDoc.title = title.trim();
    if (alt !== undefined) updateDoc.alt = alt.trim();
    if (order !== undefined && order !== '') updateDoc.order = Number(order);
    if (status !== undefined) updateDoc.status = status;

    if (req.file) {
      updateDoc.image = req.file.filename;
    } else if (image !== undefined && image !== '') {
      updateDoc.image = image;
    }

    const updated = await GreenCampusGallery.findByIdAndUpdate(
      id,
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, message: 'Gallery item updated successfully', item: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update gallery item', error: error.message });
  }
};

// DELETE /api/green-campus/gallery/:id
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GreenCampusGallery.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete gallery item', error: error.message });
  }
};

// POST /api/green-campus/seed
exports.seedDefaultGreenCampus = async (req, res) => {
  try {
    const { force } = req.query;
    if (force === 'true') {
      await GreenCampusInitiative.deleteMany({});
      await GreenCampusGallery.deleteMany({});
    }

    const initCount = await GreenCampusInitiative.countDocuments();
    if (initCount === 0) {
      await GreenCampusInitiative.insertMany(DEFAULT_INITIATIVES);
    }

    const galCount = await GreenCampusGallery.countDocuments();
    if (galCount === 0) {
      await GreenCampusGallery.insertMany(DEFAULT_GALLERY);
    }

    const initiatives = await GreenCampusInitiative.find().sort({ order: 1 });
    const gallery = await GreenCampusGallery.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: force === 'true' ? 'Green campus reset and seeded successfully' : 'Default green campus data ensured',
      initiativesCount: initiatives.length,
      galleryCount: gallery.length,
      initiatives,
      gallery,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to seed green campus data', error: error.message });
  }
};

