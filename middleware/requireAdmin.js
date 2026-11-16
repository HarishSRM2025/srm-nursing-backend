const jwt = require('jsonwebtoken');
const AdminUser = require('../models/adminUser');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'srm_nursing_admin_secret_key_2026');
    if (!decoded.id) throw new Error('Missing user');
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
  }
  try {
    const user = await AdminUser.findById(decoded.id).select('role');
    if (!user || user.role !== 'admin') return res.status(403).json({ success: false, message: 'Administrator access required.' });
    return next();
  } catch {
    return res.status(503).json({ success: false, message: 'Unable to verify administrator access.' });
  }
};
