const NewsLetter = require('../models/newsLetter/newsletter')

exports.uploadNewsLetter = async (req, res) => {
    try {
        const { title ,status} = req.body
        const file = req.file

        if (!title || !file) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }

        const newsLetter = new NewsLetter({
            title,
            fileName: file.filename,
            status
        })

        await newsLetter.save()
        res.status(201).json({ message: "NewsLetter uploaded successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getNewsLetter = async (req, res) => {
    try {
        const newsLetter = await NewsLetter.find()
        res.status(200).json(newsLetter)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteNewsLetter = async (req, res) => {
    try {
        const { id } = req.params
        const newsLetter = await NewsLetter.findByIdAndDelete(id)
        res.status(200).json({ message: "NewsLetter deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateNewsLetter = async (req, res) => {
    try {
        const { id } = req.params
        const { title,status } = req.body
        const file = req.file

        if (!title && !file) {
            return res.status(400).json({ message: "Please fill at least one field" })
        }

        const newsLetter = await NewsLetter.findById(id)
        if (!newsLetter) {
            return res.status(404).json({ message: "NewsLetter not found" })
        }

        if (title) {
            newsLetter.title = title
        }

        if (status) {
            newsLetter.status = status
        }

        if (file) {
            newsLetter.fileName = file.filename
        }

        await newsLetter.save()
        res.status(200).json({ message: "NewsLetter updated successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getNewsLetterById = async (req, res) => {
    try {
        const { id } = req.params
        const newsLetter = await NewsLetter.findById(id)
        res.status(200).json(newsLetter)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}