const Events = require('../models/events/events');

exports.createEvent = async(req,res) =>{
    try {
        const { title, description, startDate, endDate,status, venue, category, tags, registrationFee, registrationLink } = req.body;
        
        let parsedTags = [];
        if (tags) {
            if (Array.isArray(tags)) {
                parsedTags = tags;
            } else if (typeof tags === 'string') {
                try {
                    parsedTags = JSON.parse(tags);
                } catch (e) {
                    parsedTags = tags.split(',').map(t => t.trim());
                }
            }
        }

        const imagePaths = req.files ? req.files.map((file) => file.path) : [];

        const event = new Events({
            title,
            description,
            startDate,
            endDate,
            venue,
            status,
            category,
            tags: parsedTags,
            image: imagePaths,
            registrationFee,
            registrationLink
        });
        await event.save();
        res.status(201).json({ success: true, message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create event", error: error.message });
    }
}

exports.getAllEvents = async(req,res) =>{
    try {
        const events = await Events.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get events", error: error.message });
    }
}

exports.getEventById = async(req,res) =>{
    try {
        const event = await Events.findById(req.params.id);
        if(!event){
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get event", error: error.message });
    }
}

exports.updateEvent = async(req,res) =>{
    try {
        const { title, description, startDate, endDate, venue, category, tags,status, image, registrationFee, registrationLink } = req.body;
        
        let currentImages = [];

        if (req.body.existingImages) {
        try {
            currentImages = JSON.parse(req.body.existingImages);
        } catch (e) {
            currentImages = [];
        }
        }
        
        const newImages = req.files ? req.files.map((file) => file.path) : [];
        const combinedImages = [...currentImages, ...newImages];
        
        let parsedTags = [];
        if (tags) {
            if (Array.isArray(tags)) {
                parsedTags = tags;
            } else if (typeof tags === 'string') {
                try {
                    parsedTags = JSON.parse(tags);
                } catch (e) {
                    parsedTags = tags.split(',').map(t => t.trim());
                }
            }
        }

        const event = await Events.findByIdAndUpdate(req.params.id, {
            title,
            description,
            startDate,
            endDate,
            venue,
            category,
            status,
            tags: parsedTags,
            image: combinedImages,
            registrationFee,
            registrationLink
        }, { new: true });
        
        if(!event){
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update event", error: error.message });
    }
}

exports.deleteEvent = async(req,res) =>{
    try {
        const event = await Events.findByIdAndDelete(req.params.id);
        if(!event){
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete event", error: error.message });
    }
}