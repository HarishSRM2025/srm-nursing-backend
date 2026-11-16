const CodeOfConduct = require('../models/codeOfConduct');
const ids = CodeOfConduct.sectionIds;
const projection = '-_id -__v -createdAt -updatedAt';

exports.getSections = async (req, res) => {
  try {
    const data = await CodeOfConduct.find().select(projection).lean();
    data.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Unable to load code of conduct:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load the code of conduct.' });
  }
};

exports.saveSection = async (req, res) => {
  if (!ids.includes(req.params.id)) return res.status(404).json({ success: false, message: 'Unknown code of conduct section.' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ success: false, message: 'Provide a section object.' });
  const arrays = ['paragraphs', 'table', 'rules', 'boys', 'girls'];
  if (arrays.some(key => key in req.body && (!Array.isArray(req.body[key]) || req.body[key].some(item => item == null)))) {
    return res.status(400).json({ success: false, message: 'Lists must be arrays without empty records.' });
  }
  try {
    const candidate = new CodeOfConduct({ ...req.body, id: req.params.id });
    await candidate.validate();
    const content = candidate.toObject();
    delete content._id;
    // Replace all editable fields in this section, leaving the other sections intact.
    const data = await CodeOfConduct.findOneAndUpdate({ id: req.params.id }, { $set: content }, {
      upsert: true, runValidators: true, returnDocument: 'after',
    }).select(projection).lean();
    return res.json({ success: true, data });
  } catch (error) {
    if (['ValidationError', 'CastError', 'StrictModeError'].includes(error.name)) return res.status(400).json({ success: false, message: 'Check required titles, rule text, committee fields and positive whole rule numbers.' });
    console.error('Unable to save code of conduct:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to save the code of conduct.' });
  }
};
