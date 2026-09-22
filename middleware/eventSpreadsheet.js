const multer = require('multer');
const path = require('path');

const receiveSpreadsheet = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 0 },
    fileFilter: (req, file, callback) => {
        if (path.extname(file.originalname).toLowerCase() !== '.xlsx') {
            return callback(new Error('Upload an Excel .xlsx file using the file field'));
        }
        callback(null, true);
    }
}).single('file');

module.exports = (req, res, next) => {
    receiveSpreadsheet(req, res, error => {
        if (error) {
            return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({
                success: false,
                message: error.code === 'LIMIT_FILE_SIZE' ? 'Excel file must not exceed 10 MB' : error.message
            });
        }
        if (!req.file) return res.status(400).json({ success: false, message: 'Excel file is required in the file field' });
        next();
    });
};
