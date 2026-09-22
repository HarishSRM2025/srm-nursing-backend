const { importEvents } = require('../services/eventImport');

exports.bulkUploadEvents = async (req, res) => {
    try {
        const report = await importEvents(req.file.buffer);
        return res.status(report.failed === 0 ? 201 : report.imported > 0 ? 207 : 422).json(report);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};
