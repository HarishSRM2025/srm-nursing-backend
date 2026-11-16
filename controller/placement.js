const Placement = require('../models/placement');

exports.getPlacements = async (req, res) => {
  try {
    const data = await Placement.findOne({ key: 'placements' })
      .select('-_id -__v -key -createdAt -updatedAt').lean();
    if (!data) return res.status(404).json({ success: false, message: 'Placement data is not available yet.' });
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Unable to load placements:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load placements.' });
  }
};
