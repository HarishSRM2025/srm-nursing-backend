const Slider = require('../models/Slider/slider');

exports.addSlider = async (req, res) => {
    try {
        const { Title, Description, Tag, Order, Status } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        if (!Title || !Description || !Tag || !Order || !Status) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const slider = new Slider({
            Image: req.file.filename,
            Title,
            Description,
            Tag,
            Order: Number(Order),
            Status
        });
        await slider.save();
        res.status(201).json({ success: true, message: "Slider added successfully", slider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getSlider = async (req, res) => {
    try {
        const slider = await Slider.find().sort({ Order: 1 });
        res.status(200).json({ success: true, slider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.updateSlider = async (req, res) => {
    try {
        const { Title, Description, Tag, Order, Status } = req.body;
        const slider = await Slider.findById(req.params.id);
        if (!slider) {
            return res.status(404).json({ success: false, message: "Slider not found" });
        }
        if (Title) slider.Title = Title;
        if (Description) slider.Description = Description;
        if (Tag) slider.Tag = Tag;
        if (Order !== undefined && Order !== '') slider.Order = Number(Order);
        if (Status) slider.Status = Status;
        if (req.file) {
            slider.Image = req.file.filename;
        }
        await slider.save();
        res.status(200).json({ success: true, message: "Slider updated successfully", slider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteSlider = async (req, res) => {
    try {
        const slider = await Slider.findByIdAndDelete(req.params.id);
        if (!slider) {
            return res.status(404).json({ success: false, message: "Slider not found" });
        }
        res.status(200).json({ success: true, message: "Slider deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}