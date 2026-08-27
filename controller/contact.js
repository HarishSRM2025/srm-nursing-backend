const Contact = require("../models/contact");

// Create enquiry / contact form submission
exports.createContact = async (req, res) => {
  try {
    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      subject,
      program,
      department,
      message,
      source
    } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: "Email and message are required"
      });
    }

    const fullName = name || [firstName, lastName].filter(Boolean).join(" ") || "Website Visitor";

    const newContact = new Contact({
      name: fullName.trim(),
      firstName: firstName ? firstName.trim() : "",
      lastName: lastName ? lastName.trim() : "",
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      subject: subject || program || "General Enquiry",
      program: program || "",
      department: department || "General",
      message: message.trim(),
      source: source || "General Contact Form",
      status: "new"
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully! Our team will contact you soon.",
      contact: newContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
      error: error.message
    });
  }
};

// Get all enquiries with optional filtering & search
exports.getAllContacts = async (req, res) => {
  try {
    const { status, source, search } = req.query;
    let filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }
    if (source && source !== "All") {
      filter.source = new RegExp(source, "i");
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { program: new RegExp(search, "i") },
        { message: new RegExp(search, "i") }
      ];
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    
    // Quick statistics
    const totalCount = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: "new" });
    const inProgressCount = await Contact.countDocuments({ status: "in-progress" });
    const resolvedCount = await Contact.countDocuments({ status: "resolved" });

    res.status(200).json({
      success: true,
      total: contacts.length,
      stats: {
        total: totalCount,
        new: newCount,
        inProgress: inProgressCount,
        resolved: resolvedCount
      },
      contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message
    });
  }
};

// Get single enquiry by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch enquiry", error: error.message });
  }
};

// Update enquiry status / notes
exports.updateContact = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const contact = await Contact.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.status(200).json({ success: true, message: "Enquiry updated successfully", contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update enquiry", error: error.message });
  }
};

// Delete enquiry
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete enquiry", error: error.message });
  }
};
