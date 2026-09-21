const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs/promises')
const { randomUUID } = require('crypto')
const mongoose = require('mongoose')
const Affiliation = require('../models/affiliation')

const uploads = path.join(__dirname, '../uploads')
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            fs.mkdir(uploads, { recursive: true }).then(() => cb(null, uploads), cb)
        },
        filename: (req, file, cb) => cb(null, `${randomUUID()}.pdf`)
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf' || path.extname(file.originalname).toLowerCase() !== '.pdf') {
            return cb(new Error('Please upload a PDF file'))
        }
        cb(null, true)
    }
}).single('pdfFile')

async function removeFile(fileName) {
    if (!fileName) return
    try {
        await fs.unlink(path.join(uploads, path.basename(fileName)))
    } catch (error) {
        if (error.code !== 'ENOENT') console.error('Could not remove affiliation PDF:', error.message)
    }
}

router.param('id', (req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ message: 'Invalid affiliation ID' })
    next()
})

function receivePdf(req, res, next) {
    upload(req, res, error => {
        if (error) return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'PDF must be no larger than 10MB' : error.message })
        next()
    })
}

async function save(req, res) {
    let committed = false
    try {
        const { title, status } = req.body || {}
        if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
            return res.status(400).json({ message: 'Title is required' })
        }
        if (status !== undefined && !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Status must be active or inactive' })
        }
        if (!req.params.id && (!title || !req.file)) {
            return res.status(400).json({ message: 'Title and PDF file are required' })
        }
        if (req.params.id && title === undefined && status === undefined && !req.file) {
            return res.status(400).json({ message: 'Please provide at least one field' })
        }
        const item = req.params.id ? await Affiliation.findById(req.params.id) : new Affiliation()
        if (!item) return res.status(404).json({ message: 'Affiliation not found' })
        const previousFile = item.fileName
        if (title !== undefined) item.title = title.trim()
        if (status !== undefined) item.status = status
        if (req.file) item.fileName = req.file.filename
        await item.save()
        committed = true
        if (req.file && previousFile) await removeFile(previousFile)
        res.status(req.params.id ? 200 : 201).json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    } finally {
        if (!committed && req.file) await removeFile(req.file.filename)
    }
}

router.get('/', async (req, res) => {
    try {
        res.json(await Affiliation.find().sort({ createdAt: 1, _id: 1 }))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.post('/upload', receivePdf, save)
router.put('/:id', receivePdf, save)
router.get('/:id', async (req, res) => {
    try {
        const item = await Affiliation.findById(req.params.id)
        if (!item) return res.status(404).json({ message: 'Affiliation not found' })
        res.json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const item = await Affiliation.findByIdAndDelete(req.params.id)
        if (!item) return res.status(404).json({ message: 'Affiliation not found' })
        await removeFile(item.fileName)
        res.json({ message: 'Affiliation deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
