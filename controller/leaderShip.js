const LeaderShip = require("../models/Leadership/leadership");

exports.createLeaderShip = async (req, res) => {
    try {
        const { Name, Designation, Degree, Message, Status, order } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Profile image is required" });
        }
        
        const ProfileImage = req.file.filename;
        const leadership = new LeaderShip({
            Name,
            Designation,
            Degree,
            ProfileImage,
            Message,
            Status,
            order: order ? Number(order) : 0
        });
        
        await leadership.save();
        res.status(201).json({ success: true, message: "Leadership created successfully", leadership });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create leadership", error: error.message });
    }
}

exports.getLeaderShip = async (req, res) => {
    try {
        const leadership = await LeaderShip.find().sort({ order: 1 });
        res.status(200).json({ success: true, message: "Leadership fetched successfully", leadership });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch leadership", error: error.message });
    }
}

exports.getLeaderShipById = async (req, res) => {
    try {
        const leadership = await LeaderShip.findById(req.params.id);
        if (!leadership) {
            return res.status(404).json({ success: false, message: "Leadership member not found" });
        }
        res.status(200).json({ success: true, message: "Leadership fetched successfully", leadership });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch leadership", error: error.message });
    }
}

exports.updateLeaderShip = async (req, res) => {
    try {
        const { Name, Designation, Degree, Message, Status, order } = req.body;
        
        const leadership = await LeaderShip.findById(req.params.id);
        if (!leadership) {
            return res.status(404).json({ success: false, message: "Leadership member not found" });
        }

        if (Name) leadership.Name = Name;
        if (Designation) leadership.Designation = Designation;
        if (Degree !== undefined) leadership.Degree = Degree;
        if (Message) leadership.Message = Message;
        if (Status) leadership.Status = Status;
        if (order !== undefined) leadership.order = Number(order);
        
        if (req.file) {
            leadership.ProfileImage = req.file.filename;
        }

        await leadership.save();
        res.status(200).json({ success: true, message: "Leadership updated successfully", leadership });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update leadership", error: error.message });
    }
}

exports.deleteLeaderShip = async (req, res) => {
    try {
        const leadership = await LeaderShip.findByIdAndDelete(req.params.id);
        if (!leadership) {
            return res.status(404).json({ success: false, message: "Leadership member not found" });
        }
        res.status(200).json({ success: true, message: "Leadership deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete leadership", error: error.message });
    }
}