const Placement = require('../models/placement');

exports.updateSection = async (req, res) => {
  const { section } = req.params;
  const allowed = ['batches', 'stats', 'internationalPlacements', 'destinations', 'partners'];
  if (!allowed.includes(section)) return res.status(404).json({ success: false, message: 'Unknown placement section.' });
  if (!Array.isArray(req.body?.items) || req.body.items.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
    return res.status(400).json({ success: false, message: 'Provide an items array of placement records.' });
  }
  try {
    const candidate = new Placement({ [section]: req.body.items });
    await candidate.validate();
    const data = await Placement.findOneAndUpdate(
      { key: 'placements' }, { $set: { [section]: candidate.toObject()[section] } },
      { returnDocument: 'after', runValidators: true, upsert: true },
    ).select('-_id -__v -key -createdAt -updatedAt').lean();
    return res.json({ success: true, data });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Please check all required fields and use whole, non-negative hospital counts.' });
    }
    console.error('Unable to save placements:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to save placements. Please try again.' });
  }
};

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
