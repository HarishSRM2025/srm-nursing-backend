const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const { uploadNewsLetter, getNewsLetter, deleteNewsLetter, updateNewsLetter, getNewsLetterById } = require('../controller/newsLetter')

router.post('/upload', upload.single('pdfFile'), uploadNewsLetter)
router.get('/', getNewsLetter)
router.delete('/:id', deleteNewsLetter)
router.put('/:id', upload.single('pdfFile'), updateNewsLetter)
router.get('/:id', getNewsLetterById)

module.exports = router